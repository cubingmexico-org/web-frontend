/* eslint-disable no-constant-condition */

import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Users,
  Trophy,
  MapPin,
  Calendar,
  Mail,
  Instagram,
  Twitter,
  Medal,
  Clock,
  UserPlus,
  Settings,
  Facebook,
  Phone,
  ChartNoAxesCombined,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { db } from "@/db";
import {
  competition,
  person,
  rankAverage,
  rankSingle,
  result,
  state,
  team,
} from "@/db/schema";
import { and, count, eq, gt, inArray, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import Link from "next/link";
import { auth } from "@/auth";
import ReactMarkdown from "react-markdown";
import React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { MembersTable } from "./_components/members-table";
import { getMembers, getMembersGenderCounts } from "./_lib/queries";
import { getValidFilters } from "@/lib/data-table";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";

export default async function Page(props: {
  params: Promise<{ stateId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const stateId = (await props.params).stateId;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const session = await auth();

  const {
    teamsData,
    totalMembers,
    competitions,
    totalPodiums,
    totalSingleNationalRecords,
    totalAverageNationalRecords,
  } = await db.transaction(async (tx) => {
    const teamsData = await tx
      .select({
        name: team.name,
        description: team.description,
        image: team.image,
        coverImage: team.coverImage,
        state: state.name,
        founded: team.founded,
        socialLinks: team.socialLinks,
        isActive: team.isActive,
      })
      .from(team)
      .innerJoin(state, eq(team.stateId, state.id))
      .where(eq(team.stateId, stateId));

    const totalMembers = (await tx
      .select({
        count: count(),
      })
      .from(person)
      .where(eq(person.stateId, stateId))
      .execute()
      .then((res) => res[0]?.count ?? 0)) as number;

    const competitions = await tx
      .select({
        id: competition.id,
        name: competition.name,
        cityName: competition.cityName,
        venue: competition.venue,
        startDate: competition.startDate,
        endDate: competition.endDate,
        latitude: competition.latitude,
        longitude: competition.longitude,
      })
      .from(competition)
      .where(eq(competition.stateId, stateId))
      .orderBy(competition.startDate);

    const totalPodiums = await tx
      .select({
        pos: result.pos,
      })
      .from(result)
      .innerJoin(person, eq(result.personId, person.id))
      .where(
        and(
          eq(person.stateId, stateId),
          or(eq(result.roundTypeId, "f"), eq(result.roundTypeId, "c")),
          inArray(result.pos, [1, 2, 3]),
          gt(result.best, 0),
        ),
      );

    const totalSingleNationalRecords = await tx
      .select({
        eventId: rankSingle.eventId,
      })
      .from(rankSingle)
      .innerJoin(person, eq(rankSingle.personId, person.id))
      .where(and(eq(person.stateId, stateId), eq(rankSingle.countryRank, 1)));

    const totalAverageNationalRecords = await tx
      .select({
        eventId: rankAverage.eventId,
      })
      .from(rankAverage)
      .innerJoin(person, eq(rankAverage.personId, person.id))
      .where(and(eq(person.stateId, stateId), eq(rankAverage.countryRank, 1)));

    return {
      teamsData,
      totalMembers,
      competitions,
      totalPodiums,
      totalSingleNationalRecords,
      totalAverageNationalRecords,
    };
  });

  if (teamsData.length === 0) {
    return notFound();
  }

  const teamData = teamsData[0];

  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getMembers(
      {
        ...search,
        filters: validFilters,
      },
      stateId,
    ),
    getMembersGenderCounts(stateId),
  ]);

  const upcomingCompetitions = competitions.filter(
    (competition) => competition.startDate >= new Date(),
  );

  const pastCompetitions = competitions
    .filter((competition) => competition.endDate < new Date())
    .reverse();

  const totalNationalRecords =
    totalSingleNationalRecords.length + totalAverageNationalRecords.length;

  const foundedYear = teamData?.founded
    ? new Date(teamData.founded).getFullYear()
    : new Date().getFullYear();
  const currentYear = new Date().getFullYear();
  const activeYears = currentYear - foundedYear;

  return (
    <main className="flex-grow">
      <div className="relative h-[300px] bg-gray-200">
        <Image
          src={teamData?.coverImage || "/placeholder.svg"}
          alt={`${teamData?.name} cover`}
          className="w-full h-full object-cover"
          width={1200}
          height={400}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="container mx-auto flex items-end gap-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage
                src={teamData?.image ?? undefined}
                alt={teamData?.name ?? undefined}
              />
              <AvatarFallback>
                {teamData?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-white mb-2">
              <h1 className="text-3xl font-bold">{teamData?.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {teamData?.state}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {totalMembers} miembros
                </div>
                {teamData?.founded ? (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Desde{" "}
                    {teamData.founded.toLocaleDateString("es-ES", {
                      year: "numeric",
                    })}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              {false ? (
                <Button>
                  <UserPlus />
                  Unirse al Team
                </Button>
              ) : null}
              {false ? (
                <Button variant="outline" className="bg-white/10">
                  <Settings />
                  Administrar Team
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          defaultValue="overview"
          className="w-full"
          // onValueChange={setActiveTab}
        >
          <ScrollArea className="max-w-screen">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="members">Miembros</TabsTrigger>
              <TabsTrigger value="achievements">Logros</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>Acerca de</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{teamData?.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {teamData?.socialLinks?.email ? (
                        <a
                          href={`mailto:${teamData?.socialLinks?.email}`}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Correo electrónico
                        </a>
                      ) : null}
                      {teamData?.socialLinks?.whatsapp ? (
                        <a
                          href={`https://wa.me/${teamData?.socialLinks?.whatsapp}`}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          WhatsApp
                        </a>
                      ) : null}
                      {teamData?.socialLinks?.facebook ? (
                        <a
                          href={`https://facebook.com/${teamData?.socialLinks?.facebook}`}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                        >
                          <Facebook className="mr-2 h-4 w-4" />
                          Facebook
                        </a>
                      ) : null}
                      {teamData?.socialLinks?.instagram ? (
                        <a
                          href={`https://instagram.com/${teamData?.socialLinks?.instagram}`}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                        >
                          <Instagram className="mr-2 h-4 w-4" />
                          Instagram
                        </a>
                      ) : null}
                      {teamData?.socialLinks?.tiktok ? (
                        <a
                          href={`https://tiktok.com/${teamData?.socialLinks?.tiktok}`}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                        >
                          TikTok
                        </a>
                      ) : null}
                      {teamData?.socialLinks?.twitter ? (
                        <a
                          href={`https://twitter.com/${teamData?.socialLinks?.twitter}`}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                        >
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </a>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Logros recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        No hay logros recientes todavía
                      </p>
                      {/* {teamData.achievements.slice(0, 3).map((achievement, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <Trophy className="w-5 h-5 text-yellow-500 mt-1" />
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.year}</p>
                          </div>
                        </div>
                      ))} */}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Members */}
                <Card>
                  <CardHeader>
                    <CardTitle>Miembros destacados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <p className="text-muted-foreground">
                        No hay miembros destacados todavía
                      </p>
                      {/* {teamData.members.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex items-start gap-4">
                          <Image
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            className="w-12 h-12 rounded-full"
                            width={48}
                            height={48}
                          />
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <div className="flex gap-2 mt-2">
                              {member.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <Button variant="ghost" size="sm">
                              View Profile
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))} */}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas del Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Medal className="w-4 h-4 mr-2 text-yellow-500" />
                          Total de podios
                        </div>
                        <span className="font-semibold">
                          {totalPodiums.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                          Récords nacionales
                        </div>
                        <span className="font-semibold">
                          {totalNationalRecords}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Competencias
                        </div>
                        <span className="font-semibold">
                          {competitions.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Años activo
                        </div>
                        <span className="font-semibold">{activeYears}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="text-sm font-medium mb-2">Ver más:</div>
                        <div className="flex flex-col space-y-2">
                          <Link
                            href={`/rankings/333/single?state=${encodeURIComponent(teamData?.state ?? "")}`}
                            className="text-sm flex items-center text-blue-600 hover:underline"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Rankings de {teamData?.state}
                          </Link>
                          <Link
                            href={`/records?state=${encodeURIComponent(teamData?.state ?? "")}`}
                            className="text-sm flex items-center text-blue-600 hover:underline"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Récords de {teamData?.state}
                          </Link>
                          <Link
                            href={`/sor/single?state=${encodeURIComponent(teamData?.state ?? "")}`}
                            className="text-sm flex items-center text-blue-600 hover:underline"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Sum of Ranks de {teamData?.state}
                          </Link>
                          <Link
                            href={`/kinch?state=${encodeURIComponent(teamData?.state ?? "")}`}
                            className="text-sm flex items-center text-blue-600 hover:underline"
                          >
                            <ChartNoAxesCombined className="w-4 h-4 mr-2" />
                            Kinch Ranks de {teamData?.state}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Próximas competencias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingCompetitions.length === 0 ? (
                        <p className="text-muted-foreground">
                          No hay competencias próximas
                        </p>
                      ) : null}
                      {upcomingCompetitions.map((competition, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="font-semibold">{competition.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {competition.startDate.toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}{" "}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-2" />
                              <ReactMarkdown
                                components={{
                                  a: ({ children, href }) => (
                                    <Link
                                      className="hover:underline"
                                      href={href ?? ""}
                                      target="_blank"
                                    >
                                      {children}
                                    </Link>
                                  ),
                                }}
                              >
                                {competition.venue}
                              </ReactMarkdown>
                              , {competition.cityName}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Miembros</CardTitle>
              </CardHeader>
              <CardContent>
                <React.Suspense
                  fallback={
                    <DataTableSkeleton
                      columnCount={7}
                      filterCount={2}
                      cellWidths={[
                        "10rem",
                        "30rem",
                        "10rem",
                        "10rem",
                        "6rem",
                        "6rem",
                        "6rem",
                      ]}
                      shrinkZero
                    />
                  }
                >
                  <MembersTable promises={promises} />
                </React.Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Logros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    No hay logros registrados todavía
                  </p>
                  {/* {teamData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <div>
                        <h3 className="font-semibold text-lg">{achievement.title}</h3>
                        <p className="text-muted-foreground">{achievement.description}</p>
                        <p className="text-sm text-muted-foreground mt-2">{achievement.year}</p>
                      </div>
                    </div>
                  ))} */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Próximas competencias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {upcomingCompetitions.length === 0 ? (
                      <p className="text-muted-foreground">
                        No hay competencias próximas
                      </p>
                    ) : null}
                    {upcomingCompetitions.map((competition, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                      >
                        <Calendar className="w-6 h-6" />
                        <div className="flex-grow">
                          <h3 className="font-semibold">{competition.name}</h3>
                          <div className="text-sm text-muted-foreground mt-2">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {competition.startDate.toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}{" "}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="line-clamp-1">
                                <ReactMarkdown
                                  components={{
                                    a: ({ children, href }) => (
                                      <Link
                                        className="hover:underline"
                                        href={href ?? ""}
                                        target="_blank"
                                      >
                                        {children}
                                      </Link>
                                    ),
                                  }}
                                >
                                  {competition.venue}
                                </ReactMarkdown>
                                , {competition.cityName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`https://www.worldcubeassociation.org/competitions/${competition.id}`}
                          className={buttonVariants({ variant: "default" })}
                        >
                          Ver detalles
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competencias pasadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pastCompetitions.length === 0 ? (
                      <p className="text-muted-foreground">
                        No hay competencias pasadas
                      </p>
                    ) : null}
                    {pastCompetitions.map((competition, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                      >
                        <Calendar className="w-6 h-6" />
                        <div className="flex-grow">
                          <h3 className="font-semibold">{competition.name}</h3>
                          <div className="text-sm text-muted-foreground mt-2">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {competition.startDate.toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}{" "}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="line-clamp-1">
                                <ReactMarkdown
                                  components={{
                                    a: ({ children, href }) => (
                                      <Link
                                        className="hover:underline"
                                        href={href ?? ""}
                                        target="_blank"
                                      >
                                        {children}
                                      </Link>
                                    ),
                                  }}
                                >
                                  {competition.venue}
                                </ReactMarkdown>
                                , {competition.cityName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`https://www.worldcubeassociation.org/competitions/${competition.id}`}
                          className={buttonVariants({ variant: "default" })}
                        >
                          Ver detalles
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-lg border">
                      <div className="flex items-center">
                        <Medal className="w-5 h-5 mr-3 text-yellow-500" />
                        <div>
                          <div className="font-semibold">Total de podios</div>
                          <div className="text-sm text-muted-foreground">
                            A lo largo de la historia
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {totalPodiums.length}
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg border">
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
                        <div>
                          <div className="font-semibold">
                            Récords nacionales
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Récords nacionales actuales
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {totalNationalRecords}
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg border">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" />
                        <div>
                          <div className="font-semibold">
                            Competencias organizadas
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total de competencias en {teamData?.state}
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {competitions.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de miembros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Próximamente...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
