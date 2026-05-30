import { eventNames } from "@/lib/constants";
import { formatTime, formatTime333mbf } from "@/lib/utils";
import { getCompetitionResults } from "./queries";

export type CompetitionResultRow = Awaited<
  ReturnType<typeof getCompetitionResults>
>[number];

export interface ResultsByPersonGroup {
  personId: string;
  personName: string | null;
  results: CompetitionResultRow[];
}

export interface EventRoundGroup {
  roundTypeId: string;
  roundLabel: string;
  rows: CompetitionResultRow[];
}

export interface ResultsByEventGroup {
  eventId: string;
  eventName: string;
  rounds: EventRoundGroup[];
}

export function roundTypeLabel(id?: string | null) {
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

function roundRank(id?: string) {
  if (!id) return 3;
  const finals = ["f", "c"];
  const second = ["2", "e"];
  const first = ["1", "d"];
  if (finals.includes(id)) return 0;
  if (second.includes(id)) return 1;
  if (first.includes(id)) return 2;
  return 3;
}

export function formatBestResult(resultRow: CompetitionResultRow): string {
  if (resultRow.best <= 0) return "—";

  if (resultRow.eventId === "333fm") {
    return `${resultRow.best}`;
  }

  if (resultRow.eventId === "333mbf") {
    return formatTime333mbf(resultRow.best);
  }

  return formatTime(resultRow.best);
}

export function formatAverageResult(resultRow: CompetitionResultRow): string {
  if (resultRow.average <= 0) return "—";
  return formatTime(resultRow.average);
}

export function buildCompetitionResultsViewData(
  competitionResults: CompetitionResultRow[],
  mainEventId?: string | null,
) {
  const hasResults = competitionResults.length > 0;

  const hasPositiveResult = (resultRow: CompetitionResultRow) =>
    resultRow.best > 0 || resultRow.average > 0;

  const mainEventResults = competitionResults
    .filter(
      (resultRow) =>
        resultRow.eventId === mainEventId &&
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
    }, new Map<string, CompetitionResultRow[]>()),
  );

  const resultsByPerson = competitionResults.reduce(
    (accumulator, resultRow) => {
      const existing = accumulator.get(resultRow.personId) ?? {
        personId: resultRow.personId,
        personName: resultRow.personName,
        results: [] as CompetitionResultRow[],
      };

      existing.results.push(resultRow);
      accumulator.set(resultRow.personId, existing);

      return accumulator;
    },
    new Map<string, ResultsByPersonGroup>(),
  );

  const groupedByPerson = Array.from(resultsByPerson.values()).sort(
    (left, right) => {
      const leftName = left.personName ?? left.personId;
      const rightName = right.personName ?? right.personId;

      return leftName.localeCompare(rightName, "es-MX");
    },
  );

  const groupedResultsByEvent = Array.from(
    competitionResults.reduce((accumulator, resultRow) => {
      const eventId = resultRow.eventId ?? "";
      const rounds =
        accumulator.get(eventId) ?? new Map<string, CompetitionResultRow[]>();
      const roundId = resultRow.roundTypeId ?? "";
      const list = rounds.get(roundId) ?? [];
      list.push(resultRow);
      rounds.set(roundId, list);
      accumulator.set(eventId, rounds);
      return accumulator;
    }, new Map<string, Map<string, CompetitionResultRow[]>>()),
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
  })) satisfies ResultsByEventGroup[];

  return {
    hasResults,
    mainEventResults,
    podiumGroups,
    groupedByPerson,
    groupedResultsByEvent,
  };
}
