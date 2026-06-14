import "server-only";
import { db } from "@/db";
import { roundRank } from "@/lib/utils";
import {
  championship,
  competition,
  competitionOrganizer,
  delegate,
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
import type {
  DelegateStatus,
  Medals,
  Records,
  WcaPersonResponse,
} from "@/types/wca";
import { getOrganizerLevel, type OrganizerLevel } from "@/lib/organizer-level";
import { and, countDistinct, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export type { OrganizerLevel };

export interface PersonCompetitionLocation {
  id: string;
  name: string;
  stateId: string | null;
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
  // Indicates this result set a personal record at the time (history)
  isPersonalRecordSingle?: boolean;
  isPersonalRecordAverage?: boolean;
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

type RecordWithStateRank = {
  id: number;
  personId: string;
  eventId: string;
  best: number;
  worldRank: number;
  continentRank: number;
  countryRank: number;
  stateRank: number | null;
};

export type PersonalRecordWithStateRank = {
  single: RecordWithStateRank;
  average?: RecordWithStateRank;
};

export type MembershipData = {
  numberOfSpeedsolvingAverages: number;
  numberOfBLDFMCMeans: number;
  hasWorldRecord: boolean;
  hasWorldChampionshipPodium: boolean;
  eventsWon: number;
} | null;

export type OrganizerStatus = {
  organizedCompetitionCount: number;
  level: OrganizerLevel;
} | null;

export async function getPersonData(wcaId: string): Promise<{
  person: {
    wcaId: string;
    name: string | null;
    gender: string | null;
    delegateStatus: DelegateStatus;
    state: string | null;
  };
  competitionCount: number;
  solveCount: number;
  personalRecords: Record<string, PersonalRecordWithStateRank>;
  medals: Medals;
  regionalRecords: Records;
} | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`person-data-${wcaId}`);

  try {
    const personDataRow = await db
      .select({
        name: person.name,
        gender: person.gender,
        wcaId: person.wcaId,
        state: state.name,
      })
      .from(person)
      .leftJoin(state, eq(person.stateId, state.id))
      .where(eq(person.wcaId, wcaId))
      .then((res) => res[0]);

    if (!personDataRow) return null;

    const delegateRow = await db
      .select({ level: delegate.level })
      .from(delegate)
      .where(and(eq(delegate.personId, wcaId), eq(delegate.status, "active")))
      .limit(1)
      .then((res) => res[0]);

    const competitionCountRow = await db
      .select({
        competitionCount: sql<number>`COUNT(DISTINCT ${result.competitionId})`,
      })
      .from(result)
      .where(eq(result.personId, wcaId));

    const competitionCount = Number(
      competitionCountRow[0]?.competitionCount ?? 0,
    );

    const solveCountRow = await db
      .select({
        solveCount: sql<number>`COUNT(*) FILTER (WHERE ${resultAttempts.value} > 0)`,
      })
      .from(result)
      .innerJoin(resultAttempts, eq(resultAttempts.resultId, result.id))
      .where(eq(result.personId, wcaId));

    const solveCount = Number(solveCountRow[0]?.solveCount ?? 0);

    const medalsRow = await db
      .select({
        gold: sql<number>`COUNT(*) FILTER (WHERE ${result.pos} = 1 AND ${result.roundTypeId} IN('f','c'))`,
        silver: sql<number>`COUNT(*) FILTER (WHERE ${result.pos} = 2 AND ${result.roundTypeId} IN('f','c'))`,
        bronze: sql<number>`COUNT(*) FILTER (WHERE ${result.pos} = 3 AND ${result.roundTypeId} IN('f','c'))`,
      })
      .from(result)
      .where(and(eq(result.personId, wcaId), gt(result.best, 0)));

    const medals = {
      gold: Number(medalsRow[0]?.gold ?? 0),
      silver: Number(medalsRow[0]?.silver ?? 0),
      bronze: Number(medalsRow[0]?.bronze ?? 0),
      total:
        Number(medalsRow[0]?.gold ?? 0) +
        Number(medalsRow[0]?.silver ?? 0) +
        Number(medalsRow[0]?.bronze ?? 0),
    };

    const recordsRow = await db
      .select({
        world: sql<number>`COUNT(DISTINCT CASE WHEN ${result.regionalSingleRecord} = 'WR' OR ${result.regionalAverageRecord} = 'WR' THEN ${result.eventId} ELSE NULL END)`,
        continental: sql<number>`COUNT(DISTINCT CASE WHEN ${result.regionalSingleRecord} = 'CR' OR ${result.regionalAverageRecord} = 'CR' THEN ${result.eventId} ELSE NULL END)`,
        national: sql<number>`COUNT(DISTINCT CASE WHEN ${result.regionalSingleRecord} = 'NR' OR ${result.regionalAverageRecord} = 'NR' THEN ${result.eventId} ELSE NULL END)`,
      })
      .from(result)
      .where(eq(result.personId, wcaId));

    const regionalRecords = {
      world: Number(recordsRow[0]?.world ?? 0),
      continental: Number(recordsRow[0]?.continental ?? 0),
      national: Number(recordsRow[0]?.national ?? 0),
      total:
        Number(recordsRow[0]?.world ?? 0) +
        Number(recordsRow[0]?.continental ?? 0) +
        Number(recordsRow[0]?.national ?? 0),
    };

    const singles = await db
      .select({
        eventId: rankSingle.eventId,
        best: rankSingle.best,
        worldRank: rankSingle.worldRank,
        continentRank: rankSingle.continentRank,
        countryRank: rankSingle.countryRank,
        stateRank: rankSingle.stateRank,
      })
      .from(rankSingle)
      .where(eq(rankSingle.personId, wcaId));

    const averages = await db
      .select({
        eventId: rankAverage.eventId,
        best: rankAverage.best,
        worldRank: rankAverage.worldRank,
        continentRank: rankAverage.continentRank,
        countryRank: rankAverage.countryRank,
        stateRank: rankAverage.stateRank,
      })
      .from(rankAverage)
      .where(eq(rankAverage.personId, wcaId));

    const personalRecords: Record<string, PersonalRecordWithStateRank> = {};

    for (const s of singles) {
      const existingRecord =
        personalRecords[s.eventId] ?? ({} as PersonalRecordWithStateRank);
      existingRecord.single = {
        id: 0,
        personId: wcaId,
        eventId: s.eventId,
        best: s.best,
        worldRank: s.worldRank ?? 0,
        continentRank: s.continentRank ?? 0,
        countryRank: s.countryRank ?? 0,
        stateRank: s.stateRank,
      };
      personalRecords[s.eventId] = existingRecord;
    }

    for (const a of averages) {
      const existingRecord =
        personalRecords[a.eventId] ?? ({} as PersonalRecordWithStateRank);
      existingRecord.average = {
        id: 0,
        personId: wcaId,
        eventId: a.eventId,
        best: a.best,
        worldRank: a.worldRank ?? 0,
        continentRank: a.continentRank ?? 0,
        countryRank: a.countryRank ?? 0,
        stateRank: a.stateRank,
      };
      personalRecords[a.eventId] = existingRecord;
    }

    const resultObject = {
      person: {
        wcaId: personDataRow.wcaId,
        name: personDataRow.name,
        gender: personDataRow.gender,
        delegateStatus: delegateRow?.level ?? null,
        state: personDataRow.state ?? null,
      },
      competitionCount,
      solveCount,
      personalRecords,
      medals,
      regionalRecords,
    };

    return resultObject;
  } catch (err) {
    console.error(err);
    return null;
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

export async function getOrganizerStatus(
  wcaId: string,
): Promise<OrganizerStatus> {
  "use cache";
  cacheLife("days");
  cacheTag(`organizer-status-${wcaId}`);

  try {
    const data = await db
      .select({
        organizedCompetitionCount: sql<number>`COUNT(DISTINCT ${competitionOrganizer.competitionId})`,
      })
      .from(organizer)
      .leftJoin(
        competitionOrganizer,
        eq(competitionOrganizer.organizerId, organizer.id),
      )
      .where(and(eq(organizer.personId, wcaId), eq(organizer.status, "active")))
      .then((res) => res[0]);

    const organizedCompetitionCount = Number(
      data?.organizedCompetitionCount ?? 0,
    );

    if (organizedCompetitionCount === 0) {
      return null;
    }

    const personRow = await db
      .select({ gender: person.gender })
      .from(person)
      .where(eq(person.wcaId, wcaId))
      .then((res) => res[0]);

    const gender = personRow?.gender ?? null;
    const level = getOrganizerLevel(organizedCompetitionCount, gender);

    return {
      organizedCompetitionCount,
      level,
    };
  } catch (err) {
    console.error(err);
    return null;
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
        stateId: competition.stateId,
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

    // Compute personal record history per event group: iterate chronologically
    if (selectedEventGroup) {
      // Sort ascending by date to walk through history. When dates are equal,
      // order by round properly (first rounds before second rounds before finals),
      // then by position and best as tie-breakers.
      const chronological = selectedEventGroup.results.slice().sort((a, b) => {
        const dateDelta =
          Date.parse(a.competitionStartDate) -
          Date.parse(b.competitionStartDate);
        if (dateDelta !== 0) return dateDelta;

        const roundDelta = roundRank(b.roundTypeId) - roundRank(a.roundTypeId);
        if (roundDelta !== 0) return roundDelta;

        return (a.position ?? 999) - (b.position ?? 999) || a.best - b.best;
      });

      let bestSingleSeen = 0;
      let bestAverageSeen = 0;

      for (const r of chronological) {
        // single: lower is better
        if (r.best > 0 && (bestSingleSeen === 0 || r.best <= bestSingleSeen)) {
          r.isPersonalRecordSingle = true;
          bestSingleSeen = r.best;
        } else {
          r.isPersonalRecordSingle = false;
        }

        // average: lower is better and must be > 0
        if (
          r.average > 0 &&
          (bestAverageSeen === 0 || r.average <= bestAverageSeen)
        ) {
          r.isPersonalRecordAverage = true;
          bestAverageSeen = r.average;
        } else {
          r.isPersonalRecordAverage = false;
        }
      }
    }

    return selectedEventGroup ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getPersonDataFromWCA(
  wcaId: string,
): Promise<WcaPersonResponse | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`person-data-wca-${wcaId}`);

  try {
    const response = await fetch(
      `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
      {
        next: {
          revalidate: 60 * 60 * 24, // 1 day
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch person data from WCA API: ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
