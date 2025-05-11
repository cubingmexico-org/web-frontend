import "server-only";
import { db } from "@/db";
import { state, person, type State, result, competition } from "@/db/schema";
import {
  and,
  count,
  ilike,
  gt,
  eq,
  desc,
  asc,
  inArray,
  countDistinct,
  sql,
} from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { type GetPersonsSchema } from "./validations";

export async function getPersons(input: GetPersonsSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where = and(
          input.name ? ilike(person.name, `%${input.name}%`) : undefined,
          input.state.length > 0 ? inArray(state.name, input.state) : undefined,
          input.gender.length > 0
            ? inArray(person.gender, input.gender)
            : undefined,
        );

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) => {
                switch (item.id) {
                  case "state":
                    return item.desc ? desc(state.name) : asc(state.name);
                  case "competitions":
                    return item.desc
                      ? desc(countDistinct(result.competitionId))
                      : asc(countDistinct(result.competitionId));
                  case "states":
                    return item.desc
                      ? desc(countDistinct(competition.stateId))
                      : asc(countDistinct(competition.stateId));
                  case "podiums":
                    return item.desc
                      ? desc(
                          sql`count(CASE WHEN ${result.roundTypeId} IN ('f', 'c') AND ${result.pos} IN (1, 2, 3) AND ${result.best} > 0 THEN 1 END)`,
                        )
                      : asc(
                          sql`count(CASE WHEN ${result.roundTypeId} IN ('f', 'c') AND ${result.pos} IN (1, 2, 3) AND ${result.best} > 0 THEN 1 END)`,
                        );
                  default:
                    return item.desc
                      ? desc(person[item.id])
                      : asc(person[item.id]);
                }
              })
            : [asc(person.name)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              id: person.id,
              name: person.name,
              gender: person.gender,
              state: state.name,
              competitions: countDistinct(result.competitionId),
              states: countDistinct(competition.stateId),
              podiums: count(
                sql`CASE 
                      WHEN ${result.roundTypeId} IN ('f', 'c') 
                      AND ${result.pos} IN (1, 2, 3) 
                      AND ${result.best} > 0 
                      THEN 1 
                    END`,
              ),
            })
            .from(person)
            .leftJoin(state, eq(person.stateId, state.id))
            .innerJoin(result, eq(person.id, result.personId))
            .innerJoin(competition, eq(result.competitionId, competition.id))
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .groupBy(person.id, state.name)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(person)
            .leftJoin(state, eq(person.stateId, state.id))
            .innerJoin(result, eq(person.id, result.personId))
            .innerJoin(competition, eq(result.competitionId, competition.id))
            .where(where)
            .groupBy(person.id, state.name)
            .execute()
            .then((res) => res.length)) as number;

          return {
            data,
            total,
          };
        });

        const pageCount = Math.ceil(total / input.perPage);
        return { data, pageCount };
      } catch (err) {
        console.error(err);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["persons"],
    },
  )();
}

export async function getPersonsStateCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            state: state.name,
            count: count(),
          })
          .from(person)
          .leftJoin(state, eq(person.stateId, state.id))
          .groupBy(state.name)
          .having(gt(count(), 0))
          .orderBy(state.name)
          .then((res) =>
            res.reduce(
              (acc, { state, count }) => {
                if (!state) return acc;
                acc[state] = count;
                return acc;
              },
              {} as Record<State["name"], number>,
            ),
          );
      } catch (err) {
        console.error(err);
        return {} as Record<State["name"], number>;
      }
    },
    ["persons-state-counts"],
    {
      revalidate: 3600,
    },
  )();
}

export async function getPersonsGenderCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            gender: person.gender,
            count: count(),
          })
          .from(person)
          .groupBy(person.gender)
          .having(gt(count(), 0))
          .orderBy(person.gender)
          .then((res) =>
            res.reduce(
              (acc, { gender, count }) => {
                if (!gender) return acc;
                acc[gender] = count;
                return acc;
              },
              {} as Record<string, number>,
            ),
          );
      } catch (err) {
        console.error(err);
        return {} as Record<string, number>;
      }
    },
    ["persons-gender-counts"],
    {
      revalidate: 3600,
    },
  )();
}
