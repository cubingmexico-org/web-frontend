import "server-only";
import { db } from "@/db";
import { event, state, person, result, competition } from "@/db/schema";
import { and, eq, gt, notInArray, sql } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { EXCLUDED_EVENTS } from "@/lib/constants";
import { GetRecordsSchema } from "./validations";

export async function getRecords(input: GetRecordsSchema) {
  return await unstable_cache(
    async () => {
      try {
        const singleWhere = and(
          input.state ? eq(state.name, input.state) : undefined,
          input.gender ? eq(person.gender, input.gender) : undefined,
          notInArray(result.eventId, EXCLUDED_EVENTS),
          gt(result.best, 0),
        );

        const averageWhere = and(
          input.state ? eq(state.name, input.state) : undefined,
          input.gender ? eq(person.gender, input.gender) : undefined,
          notInArray(result.eventId, EXCLUDED_EVENTS),
          gt(result.average, 0),
        );

        const combinedRecords = await db.transaction(async (tx) => {
          const singleRankedResults = tx.$with("ranked_results").as(
            tx
              .select({
                eventId: result.eventId,
                personId: result.personId,
                best: result.best,
                competitionId: result.competitionId,
                value1: result.value1,
                value2: result.value2,
                value3: result.value3,
                value4: result.value4,
                value5: result.value5,
                rowNum:
                  sql<number>`row_number() OVER (PARTITION BY ${result.eventId} ORDER BY ${result.best} ASC)`.as(
                    "rn",
                  ),
              })
              .from(result)
              .innerJoin(person, eq(result.personId, person.id))
              .leftJoin(state, eq(person.stateId, state.id))
              .where(singleWhere),
          );

          const singleRecords = await tx
            .with(singleRankedResults)
            .select({
              eventId: singleRankedResults.eventId,
              eventName: event.name,
              overallBest: singleRankedResults.best,
              personName: person.name,
              personGender: person.gender,
              personState: state.name,
              personId: singleRankedResults.personId,
              competitionId: singleRankedResults.competitionId,
              competitionName: competition.name,
              value1: singleRankedResults.value1,
              value2: singleRankedResults.value2,
              value3: singleRankedResults.value3,
              value4: singleRankedResults.value4,
              value5: singleRankedResults.value5,
            })
            .from(singleRankedResults)
            .innerJoin(person, eq(singleRankedResults.personId, person.id))
            .innerJoin(event, eq(singleRankedResults.eventId, event.id))
            .innerJoin(
              competition,
              eq(singleRankedResults.competitionId, competition.id),
            )
            .leftJoin(state, eq(person.stateId, state.id))
            .where(and(eq(singleRankedResults.rowNum, 1)))
            .orderBy(event.rank);

          const averageRankedResults = tx.$with("ranked_results").as(
            tx
              .select({
                eventId: result.eventId,
                personId: result.personId,
                best: result.average,
                competitionId: result.competitionId,
                value1: result.value1,
                value2: result.value2,
                value3: result.value3,
                value4: result.value4,
                value5: result.value5,
                rowNum:
                  sql<number>`row_number() OVER (PARTITION BY ${result.eventId} ORDER BY ${result.average} ASC)`.as(
                    "rn",
                  ),
              })
              .from(result)
              .innerJoin(person, eq(result.personId, person.id))
              .leftJoin(state, eq(person.stateId, state.id))
              .where(averageWhere),
          );

          const averageRecords = await tx
            .with(averageRankedResults)
            .select({
              eventId: averageRankedResults.eventId,
              eventName: event.name,
              overallBest: averageRankedResults.best,
              personName: person.name,
              personGender: person.gender,
              personState: state.name,
              personId: averageRankedResults.personId,
              competitionId: averageRankedResults.competitionId,
              competitionName: competition.name,
              value1: averageRankedResults.value1,
              value2: averageRankedResults.value2,
              value3: averageRankedResults.value3,
              value4: averageRankedResults.value4,
              value5: averageRankedResults.value5,
            })
            .from(averageRankedResults)
            .innerJoin(person, eq(averageRankedResults.personId, person.id))
            .innerJoin(event, eq(averageRankedResults.eventId, event.id))
            .innerJoin(
              competition,
              eq(averageRankedResults.competitionId, competition.id),
            )
            .leftJoin(state, eq(person.stateId, state.id))
            .where(and(eq(averageRankedResults.rowNum, 1)))
            .orderBy(event.rank);

          const combinedRecords = singleRecords.map((singleRecord) => {
            const averageRecord = averageRecords.find(
              (avg) => avg.eventId === singleRecord.eventId,
            );
            return {
              eventName: singleRecord.eventName,
              eventId: singleRecord.eventId,
              single: {
                best: singleRecord.overallBest,
                personId: singleRecord.personId,
                name: singleRecord.personName,
                gender: singleRecord.personGender,
                state: singleRecord.personState,
                competitionId: singleRecord.competitionId,
                competition: singleRecord.competitionName,
                solves: {
                  value1: singleRecord.value1,
                  value2: singleRecord.value2,
                  value3: singleRecord.value3,
                  value4: singleRecord.value4,
                  value5: singleRecord.value5,
                },
              },
              average: averageRecord
                ? {
                    best: averageRecord.overallBest,
                    personId: averageRecord.personId,
                    name: averageRecord.personName,
                    gender: averageRecord.personGender,
                    state: averageRecord.personState,
                    competitionId: averageRecord.competitionId,
                    competition: averageRecord.competitionName,
                    solves: {
                      value1: averageRecord.value1,
                      value2: averageRecord.value2,
                      value3: averageRecord.value3,
                      value4: averageRecord.value4,
                      value5: averageRecord.value5,
                    },
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
