"use cache";

import "server-only";
import { db } from "@/db";
import { event, person, result, state, resultAttempts } from "@/db/schema";
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
        resultId: result.id,
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

    if (rows.length === 0) {
      return [];
    }

    const attempts = await db
      .select({
        resultId: resultAttempts.resultId,
        attemptNumber: resultAttempts.attemptNumber,
        value: resultAttempts.value,
      })
      .from(resultAttempts)
      .where(
        inArray(
          resultAttempts.resultId,
          rows.map((row) => row.resultId),
        ),
      )
      .orderBy(resultAttempts.resultId, resultAttempts.attemptNumber);

    const attemptsByResultId = attempts.reduce((accumulator, attempt) => {
      const values = accumulator.get(attempt.resultId) ?? [];
      values.push(attempt.value);
      accumulator.set(attempt.resultId, values);
      return accumulator;
    }, new Map<string, number[]>());

    const rowsWithSolves = rows.map((row) => ({
      ...row,
      solves: attemptsByResultId.get(row.resultId) ?? [],
    }));

    return Array.from(
      rowsWithSolves.reduce((accumulator, resultRow) => {
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
