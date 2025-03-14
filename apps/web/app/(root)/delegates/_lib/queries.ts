import "server-only";
import { db } from "@/db";
import {
  state,
  person,
  type State,
  delegate,
  competitionDelegate,
} from "@/db/schema";
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
} from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { type GetDelegatesSchema } from "./validations";

export async function getPersons(input: GetDelegatesSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where = and(
          input.name ? ilike(person.name, `%${input.name}%`) : undefined,
          input.state.length > 0 ? inArray(state.name, input.state) : undefined,
          input.status.length > 0
            ? inArray(delegate.status, input.status)
            : undefined,
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
                      ? desc(countDistinct(competitionDelegate.competitionId))
                      : asc(countDistinct(competitionDelegate.competitionId));
                  case "status":
                    return item.desc
                      ? desc(delegate.status)
                      : asc(delegate.status);
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
              status: delegate.status,
              competitions: countDistinct(competitionDelegate.competitionId),
            })
            .from(delegate)
            .innerJoin(
              competitionDelegate,
              eq(delegate.id, competitionDelegate.delegateId),
            )
            .innerJoin(person, eq(delegate.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .groupBy(person.id, state.name, delegate.status)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(delegate)
            .innerJoin(
              competitionDelegate,
              eq(delegate.id, competitionDelegate.delegateId),
            )
            .innerJoin(person, eq(delegate.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .where(where)
            .groupBy(person.id, state.name, delegate.status)
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
      tags: ["delegates"],
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
          .from(delegate)
          .innerJoin(person, eq(delegate.personId, person.id))
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
    ["delegates-state-counts"],
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
          .from(delegate)
          .innerJoin(person, eq(delegate.personId, person.id))
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
    ["delegates-gender-counts"],
    {
      revalidate: 3600,
    },
  )();
}

export async function getDelegateStatusCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            status: delegate.status,
            count: count(),
          })
          .from(delegate)
          .groupBy(delegate.status)
          .having(gt(count(), 0))
          .orderBy(delegate.status)
          .then((res) =>
            res.reduce(
              (acc, { status, count }) => {
                if (!status) return acc;
                acc[status] = count;
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
    ["delegates-status-counts"],
    {
      revalidate: 3600,
    },
  )();
}
