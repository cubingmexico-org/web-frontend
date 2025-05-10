import { db } from "@/db";
import { getEvents } from "@/db/queries";
import { championship, person, result, state } from "@/db/schema";
import { eq, gt, and, inArray, countDistinct, sql } from "drizzle-orm";
import { Members } from "./_components/members";
import {
  SPEEDSOLVING_AVERAGES_EVENTS,
  BLD_FMC_MEANS_EVENTS,
} from "@/lib/constants";

export default async function Page() {
  const events = await getEvents();

  const members = await db
    .select({
      id: person.id,
      name: person.name,
      gender: person.gender,
      state: state.name,
      numberOfSpeedsolvingAverages: sql<number>`COUNT(DISTINCT CASE WHEN ${result.eventId} IN(${sql.join(SPEEDSOLVING_AVERAGES_EVENTS, sql`, `)}) AND ${result.average} > 0 THEN ${result.eventId} ELSE NULL END)`,
      numberOfBLDFMCMeans: sql<number>`COUNT(DISTINCT CASE WHEN ${result.eventId} IN(${sql.join(BLD_FMC_MEANS_EVENTS, sql`, `)}) AND ${result.average} > 0 THEN ${result.eventId} ELSE NULL END)`,
      hasWorldRecord: sql<boolean>`MAX(CASE WHEN ${result.regionalSingleRecord} = 'WR' OR ${result.regionalAverageRecord} = 'WR' THEN 1 ELSE 0 END) = 1`,
      hasWorldChampionshipPodium: sql<boolean>`MAX(CASE WHEN ${result.pos} IN(1, 2, 3) AND ${result.roundTypeId} IN('f', 'c') AND ${championship.championshipType} = 'world' THEN 1 ELSE 0 END) = 1`,
      eventsWon: sql<number>`COUNT(DISTINCT CASE WHEN ${result.pos} = 1 AND ${result.roundTypeId} IN('f', 'c') THEN ${result.eventId} ELSE NULL END)`,
    })
    .from(person)
    .innerJoin(result, eq(person.id, result.personId))
    .leftJoin(state, eq(person.stateId, state.id))
    .leftJoin(
      championship,
      eq(result.competitionId, championship.competitionId),
    )
    .where(
      and(
        inArray(
          result.eventId,
          events.map((event) => event.id),
        ),
        gt(result.best, 0),
      ),
    )
    .groupBy(person.id, person.name, person.gender, state.name)
    .having(eq(countDistinct(result.eventId), events.length));

  return <Members members={members} />;
}
