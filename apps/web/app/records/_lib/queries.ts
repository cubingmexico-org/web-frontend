import "server-only";
import { db } from "@/db";
import { event, state, person, rankSingle, rankAverage } from "@/db/schema";
import { and, notInArray, sql } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { EXCLUDED_EVENTS } from "@/lib/constants";

export async function getRecords() {
  return await unstable_cache(
    async () => {
      try {
        const singleWhere = and(
          sql`${rankSingle.countryRank} = 1`,
          notInArray(event.id, EXCLUDED_EVENTS),
        );

        const averageWhere = and(
          sql`${rankAverage.countryRank} = 1`,
          notInArray(event.id, EXCLUDED_EVENTS),
        );

        const combinedRecords = await db.transaction(async (tx) => {
          const singleRecords = await tx
            .select({
              personId: rankSingle.personId,
              best: rankSingle.best,
              eventId: rankSingle.eventId,
              eventName: event.name,
              name: person.name,
              gender: person.gender,
              state: state.name,
            })
            .from(rankSingle)
            .innerJoin(event, sql`${rankSingle.eventId} = ${event.id}`)
            .innerJoin(person, sql`${rankSingle.personId} = ${person.id}`)
            .leftJoin(state, sql`${person.stateId} = ${state.id}`)
            .where(singleWhere)
            .orderBy(sql`${event.rank}`);

          const averageRecords = await tx
            .select({
              personId: rankAverage.personId,
              best: rankAverage.best,
              eventId: rankAverage.eventId,
              eventName: event.name,
              name: person.name,
              gender: person.gender,
              state: state.name,
            })
            .from(rankAverage)
            .innerJoin(event, sql`${rankAverage.eventId} = ${event.id}`)
            .innerJoin(person, sql`${rankAverage.personId} = ${person.id}`)
            .leftJoin(state, sql`${person.stateId} = ${state.id}`)
            .where(averageWhere)
            .orderBy(sql`${event.rank}`);

          const combinedRecords = singleRecords.map((singleRecord) => {
            const averageRecord = averageRecords.find(
              (avg) => avg.eventId === singleRecord.eventId,
            );
            return {
              eventName: singleRecord.eventName,
              eventId: singleRecord.eventId,
              single: {
                best: singleRecord.best,
                name: singleRecord.name,
                personId: singleRecord.personId,
                gender: singleRecord.gender,
                state: singleRecord.state,
              },
              average: averageRecord
                ? {
                  best: averageRecord.best,
                  name: averageRecord.name,
                  personId: averageRecord.personId,
                  gender: averageRecord.gender,
                  state: averageRecord.state,
                }
                : null,
            };
          });

          return combinedRecords;
        });

        return combinedRecords;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [],
    {
      revalidate: 3600,
      tags: ["combined-records"],
    },
  )();
}
