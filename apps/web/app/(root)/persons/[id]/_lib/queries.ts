import "server-only";
import { db } from "@/db";
import {
  championship,
  competition,
  organizer,
  person,
  rankAverage,
  rankSingle,
  result,
  resultAttempts,
  state,
  event,
} from "@/db/schema";
import {
  SPEEDSOLVING_AVERAGES_EVENTS,
  BLD_FMC_MEANS_EVENTS,
} from "@/lib/constants";
import type { WcaPersonResponse } from "@/types/wca";
import { and, countDistinct, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface PersonCompetitionLocation {
  id: string;
  name: string;
  stateName: string | null;
  latitude: number | null;
  longitude: number | null;
}

type PersonCompetitionResultRow = {
  resultId: string;
  eventId: string;
  eventName: string;
  eventRank: number;
  competitionId: string;
  competitionName: string;
  competitionStartDate: string;
  roundTypeId: string | null;
  position: number | null;
  best: number;
  average: number;
  solves: number[];
};

export interface PersonResultsByEventGroup {
  eventId: string;
  eventName: string;
  eventRank: number;
  results: PersonCompetitionResultRow[];
}

export interface PersonResultsEventOption {
  eventId: string;
  eventName: string;
  eventRank: number;
}

function roundRank(id?: string | null) {
  if (!id) return 3;

  const finals = ["f", "c"];
  const second = ["2", "e"];
  const first = ["1", "d"];

  if (finals.includes(id)) return 0;
  if (second.includes(id)) return 1;
  if (first.includes(id)) return 2;

  return 3;
}

export async function getWcaPersonData(
  wcaId: string,
): Promise<WcaPersonResponse | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`wca-person-data-${wcaId}`);

  try {
    const response = await fetch(
      `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function getPersonInfo(wcaId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`person-info-${wcaId}`);

  try {
    const data = await db
      .select({
        state: state.name,
        statesNames: sql<
          string[] | null
        >`array_agg(DISTINCT ${competition.stateId}) FILTER (WHERE ${competition.stateId} IS NOT NULL)`,
      })
      .from(person)
      .leftJoin(state, eq(person.stateId, state.id))
      .leftJoin(result, eq(person.wcaId, result.personId))
      .leftJoin(competition, eq(result.competitionId, competition.id))
      .where(eq(person.wcaId, wcaId))
      .groupBy(state.name);

    return data[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getSingleStateRanks(wcaId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`single-state-ranks-${wcaId}`);

  try {
    return await db
      .select({
        stateRank: rankSingle.stateRank,
        eventId: rankSingle.eventId,
      })
      .from(rankSingle)
      .where(eq(rankSingle.personId, wcaId));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getAverageStateRanks(wcaId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`average-state-ranks-${wcaId}`);

  try {
    return await db
      .select({
        stateRank: rankAverage.stateRank,
        eventId: rankAverage.eventId,
      })
      .from(rankAverage)
      .where(eq(rankAverage.personId, wcaId));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getMembershipData(wcaId: string, eventIds: string[]) {
  "use cache";
  cacheLife("days");
  cacheTag(`membership-data-${wcaId}`);

  try {
    const data = await db
      .select({
        numberOfSpeedsolvingAverages: sql<number>`COUNT(DISTINCT CASE WHEN ${result.eventId} IN(${sql.join(SPEEDSOLVING_AVERAGES_EVENTS, sql`, `)}) AND ${result.average} > 0 THEN ${result.eventId} ELSE NULL END)`,
        numberOfBLDFMCMeans: sql<number>`COUNT(DISTINCT CASE WHEN ${result.eventId} IN(${sql.join(BLD_FMC_MEANS_EVENTS, sql`, `)}) AND ${result.average} > 0 THEN ${result.eventId} ELSE NULL END)`,
        hasWorldRecord: sql<boolean>`MAX(CASE WHEN ${result.regionalSingleRecord} = 'WR' OR ${result.regionalAverageRecord} = 'WR' THEN 1 ELSE 0 END) = 1`,
        hasWorldChampionshipPodium: sql<boolean>`MAX(CASE WHEN ${result.pos} IN(1, 2, 3) AND ${result.roundTypeId} IN('f', 'c') AND ${championship.championshipType} = 'world' THEN 1 ELSE 0 END) = 1`,
        eventsWon: sql<number>`COUNT(DISTINCT CASE WHEN ${result.pos} = 1 AND ${result.roundTypeId} IN('f', 'c') THEN ${result.eventId} ELSE NULL END)`,
      })
      .from(result)
      .leftJoin(
        championship,
        eq(result.competitionId, championship.competitionId),
      )
      .where(
        and(
          eq(result.personId, wcaId),
          inArray(result.eventId, eventIds),
          gt(result.best, 0),
        ),
      )
      .having(eq(countDistinct(result.eventId), eventIds.length));

    return data[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getIsOrganizer(wcaId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`is-organizer-${wcaId}`);

  try {
    const data = await db
      .select()
      .from(organizer)
      .where(
        and(eq(organizer.personId, wcaId), eq(organizer.status, "active")),
      );

    return data.length > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getPersonCompetitionEventOptions(wcaId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`person-competition-event-options-${wcaId}`);

  try {
    return await db
      .select({
        eventId: event.id,
        eventName: event.name,
        eventRank: event.rank,
      })
      .from(result)
      .innerJoin(event, eq(result.eventId, event.id))
      .where(eq(result.personId, wcaId))
      .groupBy(event.id, event.name, event.rank)
      .orderBy(event.rank);
  } catch (err) {
    console.error(err);
    return [] satisfies PersonResultsEventOption[];
  }
}

export async function getPersonCompetitionLocations(wcaId: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`person-competition-locations-${wcaId}`);

  try {
    return await db
      .select({
        id: competition.id,
        name: competition.name,
        stateName: state.name,
        latitude: competition.latitudeMicrodegrees,
        longitude: competition.longitudeMicrodegrees,
      })
      .from(result)
      .innerJoin(competition, eq(result.competitionId, competition.id))
      .leftJoin(state, eq(competition.stateId, state.id))
      .where(eq(result.personId, wcaId))
      .groupBy(
        competition.id,
        competition.name,
        state.name,
        competition.latitudeMicrodegrees,
        competition.longitudeMicrodegrees,
      )
      .orderBy(desc(competition.startDate));
  } catch (err) {
    console.error(err);
    return [] satisfies PersonCompetitionLocation[];
  }
}

export async function getPersonCompetitionResults(
  wcaId: string,
  eventId: string,
) {
  "use cache";
  cacheLife("days");
  cacheTag(`person-competition-results-${wcaId}`);

  try {
    const rows = await db
      .select({
        resultId: result.id,
        eventId: result.eventId,
        eventName: event.name,
        eventRank: event.rank,
        competitionId: competition.id,
        competitionName: competition.name,
        competitionStartDate: competition.startDate,
        roundTypeId: result.roundTypeId,
        position: result.pos,
        best: result.best,
        average: result.average,
      })
      .from(result)
      .innerJoin(event, eq(result.eventId, event.id))
      .innerJoin(competition, eq(result.competitionId, competition.id))
      .where(and(eq(result.personId, wcaId), eq(result.eventId, eventId)))
      .orderBy(
        event.rank,
        desc(competition.startDate),
        result.pos,
        result.best,
      );

    if (rows.length === 0) {
      return null;
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

    const grouped = rows.reduce((accumulator, row) => {
      const eventGroup = accumulator.get(row.eventId) ?? {
        eventId: row.eventId,
        eventName: row.eventName,
        eventRank: row.eventRank,
        results: [] as PersonCompetitionResultRow[],
      };

      eventGroup.results.push({
        ...row,
        competitionStartDate: row.competitionStartDate.toISOString(),
        solves: attemptsByResultId.get(row.resultId) ?? [],
      });

      accumulator.set(row.eventId, eventGroup);
      return accumulator;
    }, new Map<string, PersonResultsByEventGroup>());

    const [selectedEventGroup] = Array.from(grouped.values())
      .map((group) => ({
        ...group,
        results: group.results.slice().sort((left, right) => {
          const startDateDelta =
            Date.parse(right.competitionStartDate) -
            Date.parse(left.competitionStartDate);

          if (startDateDelta !== 0) {
            return startDateDelta;
          }

          const roundDelta =
            roundRank(left.roundTypeId) - roundRank(right.roundTypeId);

          if (roundDelta !== 0) {
            return roundDelta;
          }

          return (
            (left.position ?? 999) - (right.position ?? 999) ||
            left.best - right.best
          );
        }),
      }))
      .sort((left, right) => left.eventRank - right.eventRank);

    return selectedEventGroup ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
