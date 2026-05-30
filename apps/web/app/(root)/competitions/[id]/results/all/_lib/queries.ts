"use cache";

import "server-only";
import { db } from "@/db";
import { event, person, result, state } from "@/db/schema";
import { eventNames } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import {
  roundTypeLabel,
  type CompetitionResultRow,
  type ResultsByEventGroup,
} from "../../../_lib/results";

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

export async function getCompetitionResultsGroupedByEvent(
  competitionId: string,
): Promise<ResultsByEventGroup[]> {
  cacheLife("days");
  cacheTag(`competition-results-all-${competitionId}`);

  try {
    const rows = await db
      .select({
        eventId: result.eventId,
        eventName: event.name,
        eventRank: event.rank,
        personId: result.personId,
        personName: person.name,
        personState: state.name,
        roundTypeId: result.roundTypeId,
        position: result.pos,
        best: result.best,
        average: result.average,
      })
      .from(result)
      .innerJoin(event, eq(result.eventId, event.id))
      .innerJoin(person, eq(result.personId, person.wcaId))
      .leftJoin(state, eq(person.stateId, state.id))
      .where(eq(result.competitionId, competitionId))
      .orderBy(event.rank, result.pos, result.best);

    return Array.from(
      rows.reduce((accumulator, resultRow) => {
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
  } catch (err) {
    console.error(err);
    return [];
  }
}
