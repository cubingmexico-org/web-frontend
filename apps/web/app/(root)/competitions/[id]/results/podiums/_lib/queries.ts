"use cache";

import "server-only";
import { db } from "@/db";
import { event, person, result, state } from "@/db/schema";
import { and, eq, gt, gte, inArray, lte, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import type { CompetitionResultRow } from "../../../_lib/results";

export async function getCompetitionPodiumGroups(
  competitionId: string,
): Promise<[string, CompetitionResultRow[]][]> {
  cacheLife("days");
  cacheTag(`competition-results-podiums-${competitionId}`);

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
      .where(
        and(
          eq(result.competitionId, competitionId),
          gte(result.pos, 1),
          lte(result.pos, 3),
          inArray(result.roundTypeId, ["f", "c"]),
          or(gt(result.best, 0), gt(result.average, 0)),
        ),
      )
      .orderBy(event.rank, result.pos, result.best);

    return Array.from(
      rows.reduce((accumulator, resultRow) => {
        const list = accumulator.get(resultRow.eventId) ?? [];
        list.push(resultRow);
        accumulator.set(resultRow.eventId, list);
        return accumulator;
      }, new Map<string, CompetitionResultRow[]>()),
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}
