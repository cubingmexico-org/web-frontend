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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
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
} from "lucide-react";
import Image from "next/image";
import { db } from "@/db";
import { person, state, team, teamMember } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { auth } from "@/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ stateId: string }>;
}) {
  const stateId = (await params).stateId;
  // const [activeTab, setActiveTab] = useState("overview")

  const session = await auth();

  const teamsData = await db
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

  if (teamsData.length === 0) {
    return notFound();
  }

  const teamData = teamsData[0];

  const members = await db
    .select({
      id: person.id,
      name: person.name,
      gender: person.gender,
      role: teamMember.role,
      specialties: teamMember.specialties,
    })
    .from(person)
    .leftJoin(teamMember, eq(person.id, teamMember.personId))
    .where(eq(person.stateId, stateId));

  const isAdmin = members.some(
    (member) => member.id === session?.user?.id && member.role === "leader",
  );
  const isNotMember = !members.some(
    (member) => member.id === session?.user?.id,
  );

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
                  {members.length} miembros
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
              {isNotMember ? (
                <Button>
                  <UserPlus />
                  Unirse al Team
                </Button>
              ) : null}
              {isAdmin ? (
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
          <TabsList className="w-full justify-start mb-8">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="members">Miembros</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
          </TabsList>

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
                        {/* <span className="font-semibold">{teamData.statistics.totalPodiums}</span> */}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                          Récords nacionales
                        </div>
                        {/* <span className="font-semibold">{teamData.statistics.nationalRecords}</span> */}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Competencias
                        </div>
                        {/* <span className="font-semibold">{teamData.statistics.competitionsAttended}</span> */}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Años activo
                        </div>
                        {/* <span className="font-semibold">{teamData.statistics.activeYears}</span> */}
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
                      {/* {teamData.upcomingEvents.map((event, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="font-semibold">{event.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center mt-1">
                              <Users className="w-4 h-4 mr-2" />
                              {event.participating} members participating
                            </div>
                          </div>
                        </div>
                      ))} */}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Miembro</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Especialidades</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={undefined}
                                alt={member.name ?? undefined}
                              />
                              <AvatarFallback>
                                {member.name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.role === "leader" ? "Líder" : "Miembro"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {member.specialties?.map((specialty, index) => (
                              <Badge key={index} variant="secondary">
                                <span
                                  className={`cubing-icon event-${specialty}`}
                                />
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/persons/${member.id}`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "sm" }),
                            )}
                          >
                            Ver perfil
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    {/* {teamData.upcomingEvents.map((event, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                        <Calendar className="w-6 h-6" />
                        <div className="flex-grow">
                          <h3 className="font-semibold">{event.name}</h3>
                          <div className="text-sm text-muted-foreground mt-2">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center mt-1">
                              <Users className="w-4 h-4 mr-2" />
                              {event.participating} members participating
                            </div>
                          </div>
                        </div>
                        <Button>View Details</Button>
                      </div>
                    ))} */}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competencias pasadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Próximamente...</p>
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
                          <div className="font-semibold">Total Podiums</div>
                          <div className="text-sm text-muted-foreground">
                            Across all competitions
                          </div>
                        </div>
                      </div>
                      {/* <div className="text-2xl font-bold">{teamData.statistics.totalPodiums}</div> */}
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg border">
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
                        <div>
                          <div className="font-semibold">National Records</div>
                          <div className="text-sm text-muted-foreground">
                            Current records held
                          </div>
                        </div>
                      </div>
                      {/* <div className="text-2xl font-bold">{teamData.statistics.nationalRecords}</div> */}
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg border">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" />
                        <div>
                          <div className="font-semibold">
                            Competitions Attended
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total events participation
                          </div>
                        </div>
                      </div>
                      {/* <div className="text-2xl font-bold">{teamData.statistics.competitionsAttended}</div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Member Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Detailed member statistics coming soon...
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
