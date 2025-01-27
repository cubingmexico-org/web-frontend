import "server-only";
import { db } from "@/db";
import { event, state, person, rankSingle, rankAverage } from "@/db/schema";
import { and, min, notInArray, or, sql } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { EXCLUDED_EVENTS } from "@/lib/constants";
import { GetRecordsSchema } from "./validations";

export async function getRecords(input: GetRecordsSchema) {
  return await unstable_cache(
    async () => {
      try {
        const subquerySingleWhere = await db
          .select({
            eventId: rankSingle.eventId,
            countryRank: min(rankSingle.countryRank),
          })
          .from(rankSingle)
          .innerJoin(event, sql`${rankSingle.eventId} = ${event.id}`)
          .innerJoin(person, sql`${rankSingle.personId} = ${person.id}`)
          .leftJoin(state, sql`${person.stateId} = ${state.id}`)
          .where(
            and(
              sql`${rankSingle.countryRank} != ${0}`,
              input.state ? sql`${state.name} = ${input.state}` : undefined,
              input.gender
                ? sql`${person.gender} = ${input.gender}`
                : undefined,
              notInArray(rankSingle.eventId, EXCLUDED_EVENTS),
            ),
          )
          .groupBy(rankSingle.eventId);

        const subqueryAverageWhere = await db
          .select({
            eventId: rankAverage.eventId,
            countryRank: min(rankAverage.countryRank),
          })
          .from(rankAverage)
          .innerJoin(event, sql`${rankAverage.eventId} = ${event.id}`)
          .innerJoin(person, sql`${rankAverage.personId} = ${person.id}`)
          .leftJoin(state, sql`${person.stateId} = ${state.id}`)
          .where(
            and(
              sql`${rankAverage.countryRank} != ${0}`,
              input.state ? sql`${state.name} = ${input.state}` : undefined,
              input.gender
                ? sql`${person.gender} = ${input.gender}`
                : undefined,
              notInArray(rankAverage.eventId, EXCLUDED_EVENTS),
            ),
          )
          .groupBy(rankAverage.eventId);

        const singleWhere = and(
          subquerySingleWhere.length > 0
            ? or(
                ...subquerySingleWhere.map(
                  (row) =>
                    sql`${rankSingle.eventId} = ${row.eventId} AND ${rankSingle.countryRank} = ${row.countryRank}`,
                ),
              )
            : undefined,
          input.state ? sql`${state.name} = ${input.state}` : undefined,
          input.gender ? sql`${person.gender} = ${input.gender}` : undefined,
          notInArray(event.id, EXCLUDED_EVENTS),
        );

        const averageWhere = and(
          subqueryAverageWhere.length > 0
            ? or(
                ...subqueryAverageWhere.map(
                  (row) =>
                    sql`${rankAverage.eventId} = ${row.eventId} AND ${rankAverage.countryRank} = ${row.countryRank}`,
                ),
              )
            : undefined,
          input.state ? sql`${state.name} = ${input.state}` : undefined,
          input.gender ? sql`${person.gender} = ${input.gender}` : undefined,
          notInArray(event.id, EXCLUDED_EVENTS),
        );

        const combinedRecords = await db.transaction(async (tx) => {
          const singleRecords = await tx
            .select({
              countryRank: rankSingle.countryRank,
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
              countryRank: rankAverage.countryRank,
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
                countryRank: singleRecord.countryRank,
                best: singleRecord.best,
                name: singleRecord.name,
                personId: singleRecord.personId,
                gender: singleRecord.gender,
                state: singleRecord.state,
              },
              average: averageRecord
                ? {
                    countryRank: averageRecord.countryRank,
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
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["combined-records"],
    },
  )();
}
