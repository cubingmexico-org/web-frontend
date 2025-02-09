import "server-only";
import { db } from "@/db";
import { state, person, kinchRanks, type State } from "@/db/schema";
import { and, count, ilike, gt, eq, desc, asc, inArray } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { type GetKinchSinglesSchema } from "./validations";

export async function getKinch(input: GetKinchSinglesSchema) {
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
                  case "name":
                    return item.desc ? desc(person.name) : asc(person.name);
                  case "state":
                    return item.desc ? desc(state.name) : asc(state.name);
                  case "gender":
                    return item.desc ? desc(person.gender) : asc(person.gender);
                  default:
                    return item.desc
                      ? desc(kinchRanks[item.id])
                      : asc(kinchRanks[item.id]);
                }
              })
            : [asc(kinchRanks.overall)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              rank: kinchRanks.rank,
              personId: kinchRanks.personId,
              name: person.name,
              overall: kinchRanks.overall,
              events: kinchRanks.events,
              state: state.name,
              gender: person.gender,
            })
            .from(kinchRanks)
            .innerJoin(person, eq(kinchRanks.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(kinchRanks)
            .innerJoin(person, eq(kinchRanks.personId, person.id))
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
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["kinch"],
    },
  )();
}

export async function getKinchStateCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            state: state.name,
            count: count(),
          })
          .from(kinchRanks)
          .innerJoin(person, eq(kinchRanks.personId, person.id))
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
    ["kinch-state-counts"],
    {
      revalidate: 3600,
    },
  )();
}

export async function getKinchGenderCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            gender: person.gender,
            count: count(),
          })
          .from(kinchRanks)
          .innerJoin(person, eq(kinchRanks.personId, person.id))
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
    ["kinch-gender-counts"],
    {
      revalidate: 3600,
    },
  )();
}
