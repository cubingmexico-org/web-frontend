import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import { buttonVariants } from "@workspace/ui/components/button";
import { eventNames } from "@/lib/constants";
import {
  formatAverageResult,
  formatBestResult,
  roundTypeLabel,
  type CompetitionResultRow,
  type ResultsByEventGroup,
  type ResultsByPersonGroup,
} from "../../_lib/results";

interface CompetitionHeaderData {
  event_ids: string[];
  main_event_id: string | null;
}

interface ResultsPodiumsViewProps {
  podiumGroups: [string, CompetitionResultRow[]][];
}

interface ResultsAllViewProps {
  competitionId: string;
  competitionData: CompetitionHeaderData;
  groupedResultsByEvent: ResultsByEventGroup[];
  selectedEventId: string;
}

interface ResultsByPersonViewProps {
  groupedByPerson: ResultsByPersonGroup[];
}

export function ResultsPodiumsView({ podiumGroups }: ResultsPodiumsViewProps) {
  return (
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
                      <TableHead className="text-right">Single</TableHead>
                      <TableHead className="text-right">Average</TableHead>
                      <TableHead className="text-right">Solves</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventResults
                      .slice()
                      .sort(
                        (left, right) =>
                          (left.position ?? 999) - (right.position ?? 999),
                      )
                      .map((resultRow) => (
                        <TableRow
                          key={`${resultRow.eventId}-${resultRow.personId}-${resultRow.position ?? 0}`}
                        >
                          <TableCell>{resultRow.position ?? "—"}</TableCell>
                          <TableCell className="font-medium">
                            <div>
                              {resultRow.personName ?? resultRow.personId}
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
                            {formatBestResult(resultRow)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatAverageResult(resultRow)}
                          </TableCell>
                          <TableCell className="text-right">-</TableCell>
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
  );
}

export function ResultsAllView({
  competitionId,
  competitionData,
  groupedResultsByEvent,
  selectedEventId,
}: ResultsAllViewProps) {
  const activeEvent =
    groupedResultsByEvent.find((event) => event.eventId === selectedEventId) ??
    groupedResultsByEvent[0] ??
    null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados por evento</CardTitle>
        <CardDescription>
          Revisa todas las rondas de un evento específico.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {competitionData.event_ids.map((eventId) => {
            const href = `/competitions/${competitionId}/results/all?eventId=${eventId}`;

            return (
              <Link
                key={eventId}
                href={href}
                className={cn(
                  buttonVariants({
                    variant:
                      eventId === selectedEventId ? "default" : "outline",
                    size: "sm",
                  }),
                )}
              >
                <span className={`cubing-icon event-${eventId} text-base`} />
                {eventNames[eventId] || eventId}
              </Link>
            );
          })}
        </div>

        {!activeEvent ? (
          <p className="text-sm text-muted-foreground">
            No hay resultados para el evento seleccionado.
          </p>
        ) : (
          <div className="space-y-3">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <span
                className={`cubing-icon event-${activeEvent.eventId} text-xl`}
              />
              {activeEvent.eventName}
            </h3>
            {activeEvent.rounds.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay rondas registradas para este evento.
              </p>
            ) : (
              activeEvent.rounds.map((round) => (
                <div
                  key={`${activeEvent.eventId}-${round.roundTypeId}`}
                  className="space-y-2"
                >
                  <h4 className="text-sm font-medium">{round.roundLabel}</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Posición</TableHead>
                          <TableHead>Competidor</TableHead>
                          <TableHead>Ronda</TableHead>
                          <TableHead className="text-right">Single</TableHead>
                          <TableHead className="text-right">Average</TableHead>
                          <TableHead className="text-right">Solves</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {round.rows.map((resultRow) => (
                          <TableRow
                            key={`${resultRow.eventId}-${resultRow.personId}-${resultRow.position ?? 0}`}
                          >
                            <TableCell>{resultRow.position ?? "—"}</TableCell>
                            <TableCell className="font-medium">
                              <div>
                                {resultRow.personName ?? resultRow.personId}
                              </div>
                              {resultRow.personState && (
                                <div className="text-xs text-muted-foreground">
                                  {resultRow.personState}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{round.roundLabel}</TableCell>
                            <TableCell className="text-right">
                              {formatBestResult(resultRow)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatAverageResult(resultRow)}
                            </TableCell>
                            <TableCell className="text-right">-</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ResultsByPersonView({
  groupedByPerson,
}: ResultsByPersonViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Por persona</CardTitle>
        <CardDescription>Resultados agrupados por competidor.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {groupedByPerson.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay resultados agrupados por persona.
          </p>
        ) : (
          groupedByPerson.map((personGroup) => (
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
                      <TableHead className="text-right">Resoluciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personGroup.results
                      .slice()
                      .sort(
                        (left, right) =>
                          left.eventRank - right.eventRank ||
                          (left.position ?? 999) - (right.position ?? 999),
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
                          <TableCell>{resultRow.position ?? "—"}</TableCell>
                          <TableCell>{formatBestResult(resultRow)}</TableCell>
                          <TableCell>
                            {formatAverageResult(resultRow)}
                          </TableCell>
                          <TableCell className="text-right">-</TableCell>
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
  );
}
