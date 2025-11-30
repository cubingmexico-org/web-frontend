"use cache";

import "server-only";
import { db } from "@/db";
import {
  championship,
  competition,
  delegate,
  organiser,
  person,
  rankAverage,
  rankSingle,
  result,
  state,
} from "@/db/schema";
import {
  SPEEDSOLVING_AVERAGES_EVENTS,
  BLD_FMC_MEANS_EVENTS,
} from "@/lib/constants";
import type { WcaPersonResponse } from "@/types/wca";
import { and, countDistinct, eq, gt, inArray, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getWcaPersonData(
  wcaId: string,
): Promise<WcaPersonResponse | null> {
  cacheLife("hours");
  cacheTag(`wca-person-data-${wcaId}`);

  try {
    const response = await fetch(
      `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
    );
    return response.json();
  } catch {
    return null;
  }
}

export async function getPersonInfo(wcaId: string) {
  cacheLife("hours");
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
      .leftJoin(result, eq(person.id, result.personId))
      .leftJoin(competition, eq(result.competitionId, competition.id))
      .where(eq(person.id, wcaId))
      .groupBy(state.name);

    return data[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getSingleStateRanks(wcaId: string) {
  cacheLife("hours");
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
  cacheLife("hours");
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
  cacheLife("hours");
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

export async function getIsDelegate(wcaId: string) {
  cacheLife("hours");
  cacheTag(`is-delegate-${wcaId}`);

  try {
    const data = await db
      .select()
      .from(delegate)
      .where(and(eq(delegate.personId, wcaId), eq(delegate.status, "active")));

    return data.length > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getIsOrganiser(wcaId: string) {
  cacheLife("hours");
  cacheTag(`is-organiser-${wcaId}`);

  try {
    const data = await db
      .select()
      .from(organiser)
      .where(
        and(eq(organiser.personId, wcaId), eq(organiser.status, "active")),
      );

    return data.length > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}
