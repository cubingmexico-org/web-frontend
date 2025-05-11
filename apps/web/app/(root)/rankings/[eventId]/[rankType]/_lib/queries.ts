import "server-only";
import { db } from "@/db";
import {
  state,
  type State,
  type Event,
  person,
  rankSingle,
  rankAverage,
} from "@/db/schema";
import { and, asc, count, desc, ilike, gt, inArray, ne, eq } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import type {
  GetRankAveragesSchema,
  GetRankSinglesSchema,
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
          ne(rankSingle.countryRank, 0),
          eq(rankSingle.eventId, eventId),
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
                  case "name":
                    return item.desc ? desc(person.name) : asc(person.name);
                  case "gender":
                    return item.desc ? desc(person.gender) : asc(person.gender);
                  default:
                    return item.desc
                      ? desc(rankSingle[item.id])
                      : asc(rankSingle[item.id]);
                }
              })
            : [asc(rankSingle.countryRank)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              personId: rankSingle.personId,
              stateRank: rankSingle.stateRank,
              countryRank: rankSingle.countryRank,
              name: person.name,
              best: rankSingle.best,
              state: state.name,
              gender: person.gender,
            })
            .from(rankSingle)
            .innerJoin(person, eq(rankSingle.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(rankSingle)
            .innerJoin(person, eq(rankSingle.personId, person.id))
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
    [JSON.stringify(input), eventId],
    {
      revalidate: 3600,
      tags: ["ranks-single"],
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
          .innerJoin(person, eq(rankSingle.personId, person.id))
          .leftJoin(state, eq(person.stateId, state.id))
          .where(eq(rankSingle.eventId, eventId))
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
    [eventId],
    {
      revalidate: 3600,
      tags: ["single-state-counts"],
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
          .innerJoin(person, eq(rankSingle.personId, person.id))
          .where(eq(rankSingle.eventId, eventId))
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
    [eventId],
    {
      revalidate: 3600,
      tags: ["single-gender-counts"],
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
          ne(rankAverage.countryRank, 0),
          eq(rankAverage.eventId, eventId),
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
                  case "name":
                    return item.desc ? desc(person.name) : asc(person.name);
                  case "gender":
                    return item.desc ? desc(person.gender) : asc(person.gender);
                  default:
                    return item.desc
                      ? desc(rankAverage[item.id])
                      : asc(rankAverage[item.id]);
                }
              })
            : [asc(rankAverage.countryRank)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              personId: rankAverage.personId,
              stateRank: rankAverage.stateRank,
              countryRank: rankAverage.countryRank,
              name: person.name,
              best: rankAverage.best,
              state: state.name,
              gender: person.gender,
            })
            .from(rankAverage)
            .innerJoin(person, eq(rankAverage.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(rankAverage)
            .innerJoin(person, eq(rankAverage.personId, person.id))
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
    [JSON.stringify(input), eventId],
    {
      revalidate: 3600,
      tags: ["ranks-average"],
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
          .innerJoin(person, eq(rankAverage.personId, person.id))
          .leftJoin(state, eq(person.stateId, state.id))
          .where(eq(rankAverage.eventId, eventId))
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
    [eventId],
    {
      revalidate: 3600,
      tags: ["average-state-counts"],
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
          .innerJoin(person, eq(rankAverage.personId, person.id))
          .leftJoin(state, eq(person.stateId, state.id))
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
    [eventId],
    {
      revalidate: 3600,
      tags: ["average-gender-counts"],
    },
  )();
}
