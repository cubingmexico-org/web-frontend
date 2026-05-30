"use cache";

import "server-only";
import { db } from "@/db";
import { event, person, result, state } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import type {
  CompetitionResultRow,
  ResultsByPersonGroup,
} from "../../../_lib/results";

export async function getCompetitionResultsGroupedByPerson(
  competitionId: string,
): Promise<ResultsByPersonGroup[]> {
  cacheLife("days");
  cacheTag(`competition-results-by-person-${competitionId}`);

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
      .orderBy(person.name, event.rank, result.pos, result.best);

    const groupedByPersonMap = rows.reduce((accumulator, resultRow) => {
      const existing = accumulator.get(resultRow.personId) ?? {
        personId: resultRow.personId,
        personName: resultRow.personName,
        results: [] as CompetitionResultRow[],
      };

      existing.results.push(resultRow);
      accumulator.set(resultRow.personId, existing);

      return accumulator;
    }, new Map<string, ResultsByPersonGroup>());

    const groupedByPerson = Array.from(groupedByPersonMap.values());

    return groupedByPerson.sort((left, right) => {
      const leftName = left.personName ?? left.personId;
      const rightName = right.personName ?? right.personId;
      return leftName.localeCompare(rightName, "es-MX");
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}
