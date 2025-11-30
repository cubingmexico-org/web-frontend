import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  Mail,
  ExternalLink,
  Globe,
  User,
  Award,
  Calendar,
  Clock,
} from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { eventNames } from "@/lib/constants";
import { getWcaCompetitionData } from "./_lib/queries";
import { notFound } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import ReactMarkdown from "react-markdown";
import { Map } from "./_components/map";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const competitionData = await getWcaCompetitionData(id);

  if (!competitionData) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const isRegistrationOpen = () => {
    const now = new Date();
    const openDate = new Date(competitionData.registration_open);
    const closeDate = new Date(competitionData.registration_close);
    return now >= openDate && now <= closeDate;
  };

  const registrationOpen = isRegistrationOpen();

  function extractEmail(contact: string): string | null {
    // Match [text](mailto:email) or just email
    const markdownMailto = contact.match(/\[.*?\]\(mailto:(.*?)\)/);
    if (markdownMailto) return markdownMailto[1] ?? null;
    // Match plain email
    const plainEmail = contact.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    return plainEmail ? plainEmail[0] : null;
  }

  return (
    <main className="grow container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-balance">
              {competitionData.name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{competitionData.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="size-4 text-yellow-500" />
            <p className="text-sm text-muted-foreground">
              {competitionData.number_of_bookmarks} personas guardaron esta
              competencia
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fechas</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {formatDate(competitionData.start_date)}
                {competitionData.start_date !== competitionData.end_date && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    - {formatDate(competitionData.end_date)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cuota de inscripción
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {formatCurrency(
                  competitionData.base_entry_fee_lowest_denomination,
                  competitionData.currency_code,
                )}
              </div>
              {competitionData.on_the_spot_registration && (
                <p className="text-xs text-muted-foreground">
                  En el lugar:{" "}
                  {formatCurrency(
                    competitionData.on_the_spot_entry_fee_lowest_denomination,
                    competitionData.currency_code,
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Límite de competidores
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {competitionData.competitor_limit} competidores
              </div>
              <p className="text-xs text-muted-foreground">
                {competitionData.guests_enabled
                  ? "Invitados permitidos"
                  : "No se permiten invitados"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {competitionData.event_ids.length} evento
                {competitionData.event_ids.length !== 1 ? "s" : ""}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          {registrationOpen ? (
            <Link
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white",
              )}
              href={competitionData.url + "/register"}
            >
              Inscribirse ahora
            </Link>
          ) : (
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white"
              disabled
            >
              Inscripciones cerradas
            </Button>
          )}
          <Link
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            href={competitionData.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink />
            Ver en WCA
          </Link>
        </div>
      </div>

      <Separator className="my-8" />

      <Tabs defaultValue="info" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="venue">Sede</TabsTrigger>
          <TabsTrigger value="team">Organización</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sobre esta competencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => (
                        <h1
                          {...props}
                          className="text-2xl font-bold mt-6 mb-4"
                        />
                      ),
                      h2: ({ ...props }) => (
                        <h2
                          {...props}
                          className="text-xl font-bold mt-5 mb-3"
                        />
                      ),
                      h3: ({ ...props }) => (
                        <h3
                          {...props}
                          className="text-lg font-bold mt-4 mb-2"
                        />
                      ),
                      h4: ({ ...props }) => (
                        <h4
                          {...props}
                          className="text-base font-bold mt-3 mb-2"
                        />
                      ),
                      h5: ({ ...props }) => (
                        <h5
                          {...props}
                          className="text-sm font-semibold mt-2 mb-1"
                        />
                      ),
                      h6: ({ ...props }) => (
                        <h6
                          {...props}
                          className="text-xs font-semibold mt-2 mb-1"
                        />
                      ),
                      p: ({ ...props }) => <p {...props} className="mb-4" />,
                      ul: ({ ...props }) => (
                        <ul {...props} className="list-disc ml-6 mb-4" />
                      ),
                      ol: ({ ...props }) => (
                        <ol {...props} className="list-decimal ml-6 mb-4" />
                      ),
                      a: ({ ...props }) => (
                        <a
                          {...props}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {competitionData.information}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Detalles de inscripción
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Abre</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(competitionData.registration_open)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cierra</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(competitionData.registration_close)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Límite</p>
                      <p className="text-sm text-muted-foreground">
                        {competitionData.competitor_limit} competidores
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contacto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${extractEmail(competitionData.contact) ?? ""}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {extractEmail(competitionData.contact) ?? ""}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de la competencia</CardTitle>
              <CardDescription>
                Esta competencia cuenta con {competitionData.event_ids.length}{" "}
                evento{competitionData.event_ids.length !== 1 ? "s" : ""}{" "}
                oficiales de la WCA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {competitionData.event_ids.map((eventId) => (
                  <div
                    key={eventId}
                    className={cn(
                      "flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors",
                      competitionData.main_event_id === eventId
                        ? "border-primary bg-primary/10"
                        : "border-transparent",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <span
                        className={`cubing-icon event-${eventId} text-xl`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {eventNames[eventId] || eventId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venue" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de la sede</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Ubicación</h4>
                  <p className="text-sm text-muted-foreground">
                    {competitionData.venue}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dirección</h4>
                  <p className="text-sm text-muted-foreground">
                    {competitionData.venue_address}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Detalles</h4>
                  <p className="text-sm text-muted-foreground">
                    {competitionData.venue_details}
                  </p>
                </div>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full bg-transparent",
                  )}
                  href={`https://www.google.com/maps?q=${competitionData.latitude_degrees},${competitionData.longitude_degrees}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin />
                  Ver en Google Maps
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Map
                    center={[
                      competitionData.latitude_degrees,
                      competitionData.longitude_degrees,
                    ]}
                    markers={[
                      {
                        id: competitionData.id,
                        venue: competitionData.venue,
                        address: competitionData.venue_address,
                        latitude: competitionData.latitude_degrees,
                        longitude: competitionData.longitude_degrees,
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Delegados</CardTitle>
                <CardDescription>
                  Delegados de la WCA que supervisan esta competencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitionData.delegates.map((delegate) => (
                    <div
                      key={delegate.wca_id}
                      className="flex items-center gap-4"
                    >
                      <Avatar>
                        <AvatarImage
                          src={delegate.avatar.thumb_url || "/placeholder.svg"}
                          alt={delegate.name}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{delegate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {delegate.wca_id}
                        </p>
                      </div>
                      <Link
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                        )}
                        href={
                          delegate.country.iso2 === "MX"
                            ? `/persons/${delegate.wca_id}`
                            : `https://www.worldcubeassociation.org/persons/${delegate.wca_id}`
                        }
                        target={
                          delegate.country.iso2 === "MX" ? undefined : "_blank"
                        }
                        rel={
                          delegate.country.iso2 === "MX"
                            ? undefined
                            : "noopener noreferrer"
                        }
                      >
                        <Globe />
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organizadores</CardTitle>
                <CardDescription>
                  Equipo organizador de esta competencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitionData.organizers.map((organizer) => (
                    <div
                      key={organizer.wca_id}
                      className="flex items-center gap-4"
                    >
                      <Avatar>
                        <AvatarImage
                          src={organizer.avatar.thumb_url || "/placeholder.svg"}
                          alt={organizer.name}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{organizer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {organizer.wca_id}
                        </p>
                      </div>
                      <Link
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                        )}
                        href={
                          organizer.country.iso2 === "MX"
                            ? `/persons/${organizer.wca_id}`
                            : `https://www.worldcubeassociation.org/persons/${organizer.wca_id}`
                        }
                        target={
                          organizer.country.iso2 === "MX" ? undefined : "_blank"
                        }
                        rel={
                          organizer.country.iso2 === "MX"
                            ? undefined
                            : "noopener noreferrer"
                        }
                      >
                        <Globe />
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/competitions"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <CalendarDays />
            Todas las Competencias
          </Link>
          <Link
            href={competitionData.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ExternalLink />
            Ver en WCA
          </Link>
          <Link
            href={`mailto:${extractEmail(competitionData.contact) ?? ""}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Mail />
            Contactar Organizadores
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
