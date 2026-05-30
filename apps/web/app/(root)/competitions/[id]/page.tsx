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
import { buttonVariants } from "@workspace/ui/components/button";
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
import { getCompetitionResults, getWcaCompetitionData } from "./_lib/queries";
import { notFound } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import ReactMarkdown from "react-markdown";
import { Map as CompetitionMap } from "./_components/map";
import { RegistrationButton } from "./_components/registration-button";
import { getCompetitions } from "@/db/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { formatTime } from "@/lib/utils";

function roundTypeLabel(id?: string | null) {
  if (!id) return "";
  switch (id) {
    case "0":
    case "h":
      return "Ronda clasificatoria";
    case "1":
    case "d":
      return "Primera ronda";
    case "2":
    case "e":
      return "Segunda ronda";
    case "3":
    case "g":
      return "Semi Final";
    case "b":
      return "B Final";
    case "c":
    case "f":
      return "Final";
    default:
      return id;
  }
}

function attemptsUsedForAverage(attempts: number[] | undefined, format: any) {
  const vals = (attempts ?? []).slice();
  if (vals.length === 0) return [] as number[];

  // If format indicates trimming, remove one fastest and/or one slowest
  if (format?.trimFastestN) {
    const min = Math.min(...vals);
    const idx = vals.indexOf(min);
    if (idx >= 0) vals.splice(idx, 1);
  }

  if (format?.trimSlowestN) {
    const max = Math.max(...vals);
    const idx = vals.indexOf(max);
    if (idx >= 0) vals.splice(idx, 1);
  }

  return vals;
}

export async function generateStaticParams() {
  const competitions = await getCompetitions();
  return competitions.map((competition) => ({ id: competition.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const [competitionData, competitionResults] = await Promise.all([
    getWcaCompetitionData(id),
    getCompetitionResults(id),
  ]);

  if (!competitionData) {
    notFound();
  }

  const hasResults = competitionResults.length > 0;
  const hasPositiveResult = (resultRow: (typeof competitionResults)[number]) =>
    resultRow.best > 0 || resultRow.average > 0;

  const mainEventResults = competitionResults
    .filter(
      (resultRow) =>
        resultRow.eventId === competitionData.main_event_id &&
        (resultRow.position ?? 0) >= 1 &&
        (resultRow.position ?? 0) <= 3 &&
        (resultRow.roundTypeId === "f" || resultRow.roundTypeId === "c"),
    )
    .filter(hasPositiveResult)
    .sort((left, right) => (left.position ?? 999) - (right.position ?? 999))
    .slice(0, 3);

  const podiumResults = competitionResults
    .filter(
      (resultRow) =>
        (resultRow.position ?? 0) >= 1 &&
        (resultRow.position ?? 0) <= 3 &&
        (resultRow.roundTypeId === "f" || resultRow.roundTypeId === "c"),
    )
    .filter(hasPositiveResult)
    .sort((left, right) => {
      if (left.eventRank !== right.eventRank) {
        return left.eventRank - right.eventRank;
      }

      if ((left.position ?? 0) !== (right.position ?? 0)) {
        return (left.position ?? 0) - (right.position ?? 0);
      }

      return left.best - right.best;
    });

  const podiumGroups = Array.from(
    podiumResults.reduce((accumulator, resultRow) => {
      const list = accumulator.get(resultRow.eventId) ?? [];
      list.push(resultRow);
      accumulator.set(resultRow.eventId, list);
      return accumulator;
    }, new Map<string, typeof podiumResults>()),
  );

  const resultsByPerson = competitionResults.reduce(
    (accumulator, resultRow) => {
      const existing = accumulator.get(resultRow.personId) ?? {
        personId: resultRow.personId,
        personName: resultRow.personName,
        results: [] as typeof competitionResults,
      };

      existing.results.push(resultRow);
      accumulator.set(resultRow.personId, existing);

      return accumulator;
    },
    new Map<
      string,
      {
        personId: string;
        personName: string | null;
        results: typeof competitionResults;
      }
    >(),
  );

  const groupedByPerson = Array.from(resultsByPerson.values()).sort(
    (left, right) => {
      const leftName = left.personName ?? left.personId;
      const rightName = right.personName ?? right.personId;

      return leftName.localeCompare(rightName, "es-MX");
    },
  );

  const roundRank = (id?: string) => {
    if (!id) return 3;
    const finals = ["f", "c"];
    const second = ["2", "e"];
    const first = ["1", "d"];
    if (finals.includes(id)) return 0;
    if (second.includes(id)) return 1;
    if (first.includes(id)) return 2;
    return 3;
  };

  const groupedResultsByEvent = Array.from(
    competitionResults.reduce((accumulator, resultRow) => {
      const eventId = resultRow.eventId ?? "";
      const rounds =
        accumulator.get(eventId) ??
        new Map<string, typeof competitionResults>();
      const roundId = resultRow.roundTypeId ?? "";
      const list = rounds.get(roundId) ?? [];
      list.push(resultRow);
      rounds.set(roundId, list);
      accumulator.set(eventId, rounds);
      return accumulator;
    }, new Map<string, Map<string, typeof competitionResults>>()),
  ).map(([eventId, roundsMap]) => ({
    eventId,
    eventName: eventNames[eventId] || eventId,
    rounds: Array.from(roundsMap.entries())
      .map(([roundTypeId, rows]) => ({
        roundTypeId,
        roundLabel: roundTypeLabel(roundTypeId),
        rows: rows
          .slice()
          .sort(
            (left, right) =>
              left.eventRank - right.eventRank ||
              (left.position ?? 999) - (right.position ?? 999),
          ),
      }))
      .sort((a, b) => roundRank(a.roundTypeId) - roundRank(b.roundTypeId)),
  }));

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

  function extractEmail(contact: string | null | undefined): string | null {
    if (!contact) return null;
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
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-balance">
                {competitionData.name}
              </h1>
              {competitionData.cancelled_at && (
                <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-sm font-medium">
                  Cancelada · {formatDate(competitionData.cancelled_at)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
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
          {competitionData.cancelled_at ? (
            <span
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "opacity-60 pointer-events-none",
              )}
            >
              Cancelada
            </span>
          ) : (
            <RegistrationButton
              registrationOpen={competitionData.registration_open}
              registrationClose={competitionData.registration_close}
              registrationUrl={competitionData.url}
            />
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

        {mainEventResults.length > 0 && (
          <Card className="mt-6 border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Podio del evento principal
              </CardTitle>
              <CardDescription>
                {eventNames[competitionData.main_event_id] ||
                  competitionData.main_event_id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mainEventResults.map((resultRow) => (
                <div
                  key={`${resultRow.eventId}-${resultRow.personId}-${resultRow.position ?? 0}`}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2",
                    resultRow.position === 1
                      ? "border-primary bg-background"
                      : "border-border bg-background/60",
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-sm font-semibold text-muted-foreground">
                      {resultRow.position ?? "-"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {resultRow.personName ?? resultRow.personId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {resultRow.personId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {resultRow.best > 0 ? formatTime(resultRow.best) : "—"}
                    </span>
                    <span>
                      {resultRow.average > 0
                        ? formatTime(resultRow.average)
                        : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      <Tabs defaultValue="info" className="mb-8">
        <TabsList
          className={cn(
            "grid w-full",
            hasResults ? "grid-cols-5" : "grid-cols-4",
          )}
        >
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          {hasResults && <TabsTrigger value="results">Resultados</TabsTrigger>}
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

        {hasResults && (
          <TabsContent value="results" className="mt-6">
            <Tabs defaultValue="podiums" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="podiums">Podios</TabsTrigger>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="by-person">Por Persona</TabsTrigger>
              </TabsList>

              <TabsContent value="podiums" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Podios</CardTitle>
                    <CardDescription>
                      Los resultados mexicanos del podio por evento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {podiumGroups.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No hay podios disponibles.
                      </p>
                    ) : (
                      podiumGroups.map(([eventId, eventResults]) => (
                        <div key={eventId} className="space-y-3">
                          <h3 className="text-base font-semibold">
                            {eventNames[eventId] || eventId}
                          </h3>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Posición</TableHead>
                                  <TableHead>Competidor</TableHead>
                                  <TableHead>Ronda</TableHead>
                                  <TableHead className="text-right">
                                    Single
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Average
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Solves
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {eventResults
                                  .sort(
                                    (left, right) =>
                                      (left.position ?? 999) -
                                      (right.position ?? 999),
                                  )
                                  .map((resultRow) => (
                                    <TableRow
                                      key={`${resultRow.eventId}-${resultRow.personId}-${resultRow.position ?? 0}`}
                                    >
                                      <TableCell>
                                        {resultRow.position ?? "—"}
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        <div>
                                          {resultRow.personName ??
                                            resultRow.personId}
                                        </div>
                                        {resultRow.personState && (
                                          <div className="text-xs text-muted-foreground">
                                            {resultRow.personState}
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {roundTypeLabel(resultRow.roundTypeId)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {resultRow.best > 0
                                          ? formatTime(resultRow.best)
                                          : "—"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {resultRow.average > 0
                                          ? formatTime(resultRow.average)
                                          : "—"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {resultRow.attempts &&
                                        resultRow.attempts.length > 0
                                          ? attemptsUsedForAverage(
                                              resultRow.attempts,
                                              resultRow.format,
                                            )
                                              .map((v) => formatTime(v))
                                              .join(", ")
                                          : "—"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Resultados registrados</CardTitle>
                    <CardDescription>
                      Resultados guardados en la base de datos para esta
                      competencia.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {groupedResultsByEvent.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          No hay resultados registrados.
                        </div>
                      ) : (
                        groupedResultsByEvent.map((event) => (
                          <div key={event.eventId} className="space-y-3">
                            <h3 className="text-base font-semibold flex items-center gap-2">
                              <span
                                className={`cubing-icon event-${event.eventId} text-xl`}
                              />
                              {event.eventName}
                            </h3>
                            {event.rounds.map((round) => (
                              <div
                                key={`${event.eventId}-${round.roundTypeId}`}
                                className="space-y-2"
                              >
                                <h4 className="text-sm font-medium">
                                  {round.roundLabel}
                                </h4>
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Posición</TableHead>
                                        <TableHead>Competidor</TableHead>
                                        <TableHead>Ronda</TableHead>
                                        <TableHead className="text-right">
                                          Single
                                        </TableHead>
                                        <TableHead className="text-right">
                                          Average
                                        </TableHead>
                                        <TableHead className="text-right">
                                          Solves
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {round.rows.map((resultRow) => (
                                        <TableRow
                                          key={`${resultRow.eventId}-${resultRow.personId}-${resultRow.position ?? 0}`}
                                        >
                                          <TableCell>
                                            {resultRow.position ?? "—"}
                                          </TableCell>
                                          <TableCell className="font-medium">
                                            <div>
                                              {resultRow.personName ??
                                                resultRow.personId}
                                            </div>
                                            {resultRow.personState && (
                                              <div className="text-xs text-muted-foreground">
                                                {resultRow.personState}
                                              </div>
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {round.roundLabel}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {resultRow.best > 0
                                              ? formatTime(resultRow.best)
                                              : "—"}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {resultRow.average > 0
                                              ? formatTime(resultRow.average)
                                              : "—"}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {resultRow.attempts &&
                                            resultRow.attempts.length > 0
                                              ? attemptsUsedForAverage(
                                                  resultRow.attempts,
                                                  resultRow.format,
                                                )
                                                  .map((v) => formatTime(v))
                                                  .join(", ")
                                              : "—"}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="by-person" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Por Persona</CardTitle>
                    <CardDescription>
                      Resultados agrupados por competidor.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {groupedByPerson.map((personGroup) => (
                      <div key={personGroup.personId} className="space-y-3">
                        <h3 className="text-base font-semibold">
                          {personGroup.personName ?? personGroup.personId}
                          {personGroup.results[0]?.personState && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              {personGroup.results[0].personState}
                            </span>
                          )}
                        </h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Evento</TableHead>
                                <TableHead>Ronda</TableHead>
                                <TableHead>#</TableHead>
                                <TableHead>Single</TableHead>
                                <TableHead>Average</TableHead>
                                <TableHead className="text-right">
                                  Resoluciones
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {personGroup.results
                                .slice()
                                .sort(
                                  (left, right) =>
                                    left.eventRank - right.eventRank ||
                                    (left.position ?? 999) -
                                      (right.position ?? 999),
                                )
                                .map((resultRow) => (
                                  <TableRow
                                    key={`${resultRow.eventId}-${resultRow.personId}-${resultRow.position ?? 0}-${resultRow.roundTypeId}`}
                                  >
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`cubing-icon event-${resultRow.eventId} text-lg`}
                                        />
                                        <span>{resultRow.eventName}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {roundTypeLabel(resultRow.roundTypeId)}
                                    </TableCell>
                                    <TableCell>
                                      {resultRow.position
                                        ? resultRow.position
                                        : "—"}
                                    </TableCell>
                                    <TableCell>
                                      {resultRow.best > 0
                                        ? formatTime(resultRow.best)
                                        : "—"}
                                    </TableCell>
                                    <TableCell>
                                      {resultRow.average > 0
                                        ? formatTime(resultRow.average)
                                        : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {resultRow.attempts &&
                                      resultRow.attempts.length > 0
                                        ? attemptsUsedForAverage(
                                            resultRow.attempts,
                                            resultRow.format,
                                          )
                                            .map((v) => formatTime(v))
                                            .join(", ")
                                        : "—"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        )}

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
                  <CompetitionMap
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
