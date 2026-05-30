"use cache";

import "server-only";
import { db } from "@/db";
import {
  event,
  person,
  result,
  state,
  resultAttempts,
  formats,
} from "@/db/schema";
import type { Competition } from "@/types/wca";
import { eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getWcaCompetitionData(
  competitionId: string,
): Promise<Competition | null> {
  cacheLife("days");
  cacheTag(`wca-competition-data-${competitionId}`);

  try {
    const response = await fetch(
      `https://www.worldcubeassociation.org/api/v0/competitions/${competitionId}`,
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getCompetitionResults(competitionId: string) {
  cacheLife("days");
  cacheTag(`competition-results-${competitionId}`);

  try {
    return await db.transaction(async (tx) => {
      const rows = await tx
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
          formatId: result.formatId,
        })
        .from(result)
        .innerJoin(event, eq(result.eventId, event.id))
        .innerJoin(person, eq(result.personId, person.wcaId))
        .leftJoin(state, eq(person.stateId, state.id))
        .where(eq(result.competitionId, competitionId))
        .orderBy(event.rank, result.pos, result.best);

      const resultIds = rows
        .map((r) => r.resultId)
        .filter((id): id is string => id != null);

      // If there are no results return rows with empty attempts/format
      if (resultIds.length === 0) {
        return rows.map((r) => ({
          ...r,
          attempts: [] as number[],
          format: null,
        }));
      }

      const attempts = await tx
        .select({
          resultId: resultAttempts.resultId,
          attemptNumber: resultAttempts.attemptNumber,
          value: resultAttempts.value,
        })
        .from(resultAttempts)
        .where(inArray(resultAttempts.resultId, resultIds))
        .orderBy(resultAttempts.resultId, resultAttempts.attemptNumber);

      const attemptsByResultId = attempts.reduce(
        (acc, a) => {
          if (a.resultId == null) return acc;
          const id = String(a.resultId);
          if (!acc[id]) acc[id] = [];
          acc[id].push(a.value);
          return acc;
        },
        {} as Record<string, number[]>,
      );

      const formatIds = Array.from(
        new Set(
          rows.map((r) => r.formatId).filter((id): id is string => id != null),
        ),
      );
      const formatRows = await tx
        .select({
          id: formats.id,
          expectedSolveCount: formats.expectedSolveCount,
          trimFastestN: formats.trimFastestN,
          trimSlowestN: formats.trimSlowestN,
        })
        .from(formats)
        .where(inArray(formats.id, formatIds));

      const formatById = Object.fromEntries(
        formatRows.map((f) => [String(f.id), f]),
      );

      return rows.map((r) => {
        const rid = r.resultId == null ? "" : String(r.resultId);
        const fid = r.formatId == null ? undefined : String(r.formatId);
        return {
          ...r,
          attempts: attemptsByResultId[rid] ?? [],
          format: fid ? (formatById[fid] ?? null) : null,
        };
      });
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}
