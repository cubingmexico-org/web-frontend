import "server-only";
import { db } from "@/db";
import {
  state,
  State,
  Event,
  rankSingle,
  person,
  rankAverage,
} from "@/db/schema";
import { and, asc, count, desc, ilike, sql, gt, inArray } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import {
  GetRankAveragesSchema,
  type GetRankSinglesSchema,
} from "./validations";

export async function getRankSingles(
  input: GetRankSinglesSchema,
  eventId: Event["id"],
) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where = and(
          sql`${rankSingle.countryRank} != 0`,
          sql`${rankSingle.eventId} = ${eventId}`,
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
                  ? desc(rankSingle[item.id])
                  : asc(rankSingle[item.id]),
              )
            : [asc(rankSingle.countryRank)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              personId: rankSingle.personId,
              countryRank: rankSingle.countryRank,
              name: person.name,
              best: rankSingle.best,
              state: state.name,
              gender: person.gender,
            })
            .from(rankSingle)
            .innerJoin(person, sql`${rankSingle.personId} = ${person.id}`)
            .leftJoin(state, sql`${person.stateId} = ${state.id}`)
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(rankSingle)
            .innerJoin(person, sql`${rankSingle.personId} = ${person.id}`)
            .leftJoin(state, sql`${person.stateId} = ${state.id}`)
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
    [JSON.stringify(input), eventId],
    {
      revalidate: 3600,
      tags: ["ranksSingle"],
    },
  )();
}

export async function getRankSinglesStateCounts(eventId: Event["id"]) {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            state: state.name,
            count: count(),
          })
          .from(rankSingle)
          .innerJoin(person, sql`${rankSingle.personId} = ${person.id}`)
          .leftJoin(state, sql`${person.stateId} = ${state.id}`)
          .where(sql`${rankSingle.eventId} = ${eventId}`)
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
    ["singleStateCounts", eventId],
    {
      revalidate: 3600,
    },
  )();
}

export async function getRankSinglesGenderCounts(eventId: Event["id"]) {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            gender: person.gender,
            count: count(),
          })
          .from(rankSingle)
          .innerJoin(person, sql`${rankSingle.personId} = ${person.id}`)
          .where(sql`${rankSingle.eventId} = ${eventId}`)
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
    ["singleGenderCounts", eventId],
    {
      revalidate: 3600,
    },
  )();
}

export async function getRankAverages(
  input: GetRankAveragesSchema,
  eventId: Event["id"],
) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where = and(
          sql`${rankAverage.countryRank} != 0`,
          sql`${rankAverage.eventId} = ${eventId}`,
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
                  ? desc(rankAverage[item.id])
                  : asc(rankAverage[item.id]),
              )
            : [asc(rankAverage.countryRank)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              personId: rankAverage.personId,
              countryRank: rankAverage.countryRank,
              name: person.name,
              best: rankAverage.best,
              state: state.name,
              gender: person.gender,
            })
            .from(rankAverage)
            .innerJoin(person, sql`${rankAverage.personId} = ${person.id}`)
            .leftJoin(state, sql`${person.stateId} = ${state.id}`)
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(rankAverage)
            .innerJoin(person, sql`${rankAverage.personId} = ${person.id}`)
            .leftJoin(state, sql`${person.stateId} = ${state.id}`)
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
    [JSON.stringify(input), eventId],
    {
      revalidate: 3600,
      tags: ["ranksAverage"],
    },
  )();
}

export async function getRankAveragesStateCounts(eventId: Event["id"]) {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            state: state.name,
            count: count(),
          })
          .from(rankAverage)
          .innerJoin(person, sql`${rankAverage.personId} = ${person.id}`)
          .leftJoin(state, sql`${person.stateId} = ${state.id}`)
          .where(sql`${rankAverage.eventId} = ${eventId}`)
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
    ["averageStateCounts", eventId],
    {
      revalidate: 3600,
    },
  )();
}

export async function getRankAveragesGenderCounts(eventId: Event["id"]) {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            gender: person.gender,
            count: count(),
          })
          .from(rankAverage)
          .innerJoin(person, sql`${rankAverage.personId} = ${person.id}`)
          .where(sql`${rankAverage.eventId} = ${eventId}`)
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
    ["averageGenderCounts", eventId],
    {
      revalidate: 3600,
    },
  )();
}
