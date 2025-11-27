import { buttonVariants } from "@workspace/ui/components/button";
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
  Medal,
  Clock,
  Settings,
  ChartNoAxesCombined,
  Plus,
} from "lucide-react";
import Image from "next/image";
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
import {
  getAverageNationalRecords,
  getMembers,
  getMembersGenderCounts,
  getSingleNationalRecords,
  getTeamCompetitions,
  getTeamInfo,
  getTeamPodiums,
  getTotalMembers,
  getIsTeamAdmin,
} from "./_lib/queries";
import { getValidFilters } from "@/lib/data-table";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";
import { cn } from "@workspace/ui/lib/utils";
import {
  Facebook,
  Instagram,
  TikTok,
  Twitter,
  WhatsApp,
} from "@workspace/icons";
import type { Metadata } from "next";
import { getTeam } from "@/db/queries";

type Props = {
  params: Promise<{ stateId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stateId = (await params).stateId;

  const team = await getTeam(stateId);

  return {
    title: `${team?.name} | Cubing México`,
    description: `${team?.name} es un equipo de ${team?.state} que compite en competencias de la World Cube Association.`,
  };
}

export default async function Page(props: {
  params: Promise<{ stateId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const stateId = (await props.params).stateId;
  const session = await auth();

  const team = await getTeamInfo(stateId);

  if (!team) {
    return notFound();
  }

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

  const [
    totalMembers,
    competitions,
    totalPodiums,
    totalSingleNationalRecords,
    totalAverageNationalRecords,
    isAdmin,
  ] = await Promise.all([
    getTotalMembers(stateId),
    getTeamCompetitions(stateId),
    getTeamPodiums(stateId),
    getSingleNationalRecords(stateId),
    getAverageNationalRecords(stateId),
    getIsTeamAdmin(stateId, session?.user?.id || ""),
  ]);

  const upcomingCompetitions = competitions.filter(
    (competition) => competition.startDate >= new Date(),
  );

  const pastCompetitions = competitions
    .filter((competition) => competition.endDate < new Date())
    .reverse();

  const totalNationalRecords =
    totalSingleNationalRecords.length + totalAverageNationalRecords.length;

  const foundedYear = team.founded
    ? new Date(team.founded).getFullYear()
    : new Date().getFullYear();

  const currentYear = new Date().getFullYear();

  const activeYears = currentYear - foundedYear;

  return (
    <>
      <div className="relative h-[400px] bg-gray-200">
        <Image
          src={team.coverImage || "/placeholder.svg"}
          alt={`${team.name} cover`}
          className="w-full h-full object-cover"
          width={1200}
          height={400}
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-6">
          <div className="container mx-auto flex flex-col sm:flex-row items-end gap-6">
            <div className="flex gap-6 w-full">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage
                  src={team.image ?? undefined}
                  alt={team.name ?? undefined}
                />
                <AvatarFallback>
                  {team.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-white mb-2">
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <div className="flex flex-col sm:flex-row items-start sm:gap-4 gap-2 mt-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {team.state}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {totalMembers} miembros
                  </div>
                  {team.founded ? (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Desde{" "}
                      {team.founded.toLocaleDateString("es-ES", {
                        year: "numeric",
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Link
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "default",
                  }),
                )}
                href="/teams"
              >
                <Users /> Ver todos los Teams
              </Link>
              {isAdmin ? (
                <Link
                  className={cn(
                    buttonVariants({
                      variant: "default",
                      size: "default",
                    }),
                  )}
                  href={`/teams/${stateId}/manage`}
                >
                  <Settings />
                  Administrar Team
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

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
              {/* <TabsTrigger value="achievements">Logros</TabsTrigger> */}
              <TabsTrigger value="competitions">Competencias</TabsTrigger>
              <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Acerca de</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{team.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {team.socialLinks?.email ? (
                        <a
                          href={`mailto:${team.socialLinks?.email}`}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Correo electrónico
                        </a>
                      ) : null}
                      {team.socialLinks?.whatsapp ? (
                        <Link
                          href={`https://wa.me/${team.socialLinks?.whatsapp}`}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsApp className="mr-2 h-4 w-4" />
                          WhatsApp
                        </Link>
                      ) : null}
                      {team.socialLinks?.facebook ? (
                        <Link
                          href={team.socialLinks?.facebook}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook className="mr-2 h-4 w-4" />
                          Facebook
                        </Link>
                      ) : null}
                      {team.socialLinks?.instagram ? (
                        <Link
                          href={team.socialLinks?.instagram}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="mr-2 h-4 w-4" />
                          Instagram
                        </Link>
                      ) : null}
                      {team.socialLinks?.tiktok ? (
                        <Link
                          href={team.socialLinks?.tiktok}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <TikTok className="mr-2 h-4 w-4" />
                          TikTok
                        </Link>
                      ) : null}
                      {team.socialLinks?.twitter ? (
                        <Link
                          href={team.socialLinks?.twitter}
                          className="flex items-center text-sm text-muted-foreground hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </Link>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Logros recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        No hay logros recientes todavía
                      </p>
                      {teamData.achievements.slice(0, 3).map((achievement, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <Trophy className="w-5 h-5 text-yellow-500 mt-1" />
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card> */}

                {/* Top Members */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Miembros destacados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <p className="text-muted-foreground">
                        No hay miembros destacados todavía
                      </p>
                      {teamData.members.slice(0, 3).map((member) => (
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
                      ))}
                    </div>
                  </CardContent>
                </Card> */}
              </div>

              <div className="space-y-6">
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
                      {activeYears > 0 && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Años activo
                          </div>
                          <span className="font-semibold">{activeYears}</span>
                        </div>
                      )}
                      <div className="border-t pt-3 mt-3">
                        <div className="text-sm font-medium mb-2">Ver más:</div>
                        <div className="flex flex-col space-y-2">
                          <Link
                            href={`/rankings/333/single?state=${encodeURIComponent(team.state ?? "")}`}
                            className="text-sm flex items-center text-blue-600 hover:underline"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Rankings de {team.state}
                          </Link>
                          <Link
                            href={`/records?state=${encodeURIComponent(team.state ?? "")}`}
                            className="text-sm flex items-center text-blue-600 hover:underline"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Récords de {team.state}
                          </Link>
                          <Link
                            href={`/sor/single?state=${encodeURIComponent(team.state ?? "")}`}
                            className="text-sm flex items-center text-blue-600 hover:underline"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Sum of Ranks de {team.state}
                          </Link>
                          <Link
                            href={`/kinch/${stateId}`}
                            className="text-sm flex items-center text-blue-600 hover:underline"
                          >
                            <ChartNoAxesCombined className="w-4 h-4 mr-2" />
                            Kinch Ranks de {team.state}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                                  timeZone: "UTC",
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

          {/* <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Logros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    No hay logros registrados todavía
                  </p>
                   {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <div>
                        <h3 className="font-semibold text-lg">{achievement.title}</h3>
                        <p className="text-muted-foreground">{achievement.description}</p>
                        <p className="text-sm text-muted-foreground mt-2">{achievement.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          <TabsContent value="competitions">
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
                        <div className="grow">
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
                        <div className="grow">
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
                          target="_blank"
                          rel="noopener noreferrer"
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
            <div className="grid gap-6">
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
                            Total de competencias en {team.state}
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

              {/* <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de miembros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Próximamente...</p>
                </CardContent>
              </Card> */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
