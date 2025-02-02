import "server-only";
import { db } from "@/db";
import { type State, state, person, sumOfRanks } from "@/db/schema";
import { and, count, ilike, gt, eq, desc, asc, inArray } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { type GetSORSinglesSchema } from "./validations";

export async function getSOR(
  input: GetSORSinglesSchema,
  rankType: "single" | "average",
) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where = and(
          eq(sumOfRanks.resultType, rankType),
          input.name ? ilike(person.name, `%${input.name}%`) : undefined,
          input.state.length > 0 ? inArray(state.name, input.state) : undefined,
          input.gender.length > 0
            ? inArray(person.gender, input.gender)
            : undefined,
        );

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) =>
                item.desc
                  ? desc(sumOfRanks[item.id])
                  : asc(sumOfRanks[item.id]),
              )
            : [asc(sumOfRanks.overall)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              rank: sumOfRanks.rank,
              personId: sumOfRanks.personId,
              name: person.name,
              overall: sumOfRanks.overall,
              events: sumOfRanks.events,
              state: state.name,
              gender: person.gender,
            })
            .from(sumOfRanks)
            .innerJoin(person, eq(sumOfRanks.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(sumOfRanks)
            .innerJoin(person, eq(sumOfRanks.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)) as number;

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
    [JSON.stringify(input), rankType],
    {
      revalidate: 3600,
      tags: ["sor"],
    },
  )();
}

export async function getSORStateCounts(rankType: "single" | "average") {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            state: state.name,
            count: count(),
          })
          .from(sumOfRanks)
          .innerJoin(person, eq(sumOfRanks.personId, person.id))
          .leftJoin(state, eq(person.stateId, state.id))
          .where(eq(sumOfRanks.resultType, rankType))
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
    ["sor-state-counts", rankType],
    {
      revalidate: 3600,
    },
  )();
}

export async function getSORGenderCounts(rankType: "single" | "average") {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            gender: person.gender,
            count: count(),
          })
          .from(sumOfRanks)
          .innerJoin(person, eq(sumOfRanks.personId, person.id))
          .where(eq(sumOfRanks.resultType, rankType))
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
    ["sor-gender-counts", rankType],
    {
      revalidate: 3600,
    },
  )();
}
