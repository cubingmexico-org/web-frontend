/* eslint-disable @typescript-eslint/no-unused-vars */
import "server-only";
import { db } from "@/db";
import {
  competition,
  state,
  event,
  State,
  Event,
  competitionEvent,
  rankSingle,
  person,
} from "@/db/schema";
import {
  and,
  asc,
  count,
  desc,
  ilike,
  sql,
  gt,
  inArray,
  gte,
  lte,
} from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { type GetRankSinglesSchema } from "./validations";

export async function getRankSingles(input: GetRankSinglesSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where = and(
          sql`${rankSingle.eventId} = '333'`,
          input.name ? ilike(person.name, `%${input.name}%`) : undefined,
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
            })
            .from(rankSingle)
            .innerJoin(
              person,
              sql`${rankSingle.personId} = ${person.id}`,
            )
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(rankSingle)
            .innerJoin(
              person,
              sql`${rankSingle.personId} = ${person.id}`,
            )
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
      tags: ["competitions"],
    },
  )();
}

export async function getStateCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            state: state.name,
            count: count(),
          })
          .from(competition)
          .innerJoin(state, sql`${competition.stateId} = ${state.id}`)
          .groupBy(state.name)
          .having(gt(count(), 0))
          .orderBy(state.name)
          .then((res) =>
            res.reduce(
              (acc, { state, count }) => {
                acc[state] = count;
                return acc;
              },
              {} as Record<State["name"], number>,
            ),
          );
      } catch (err) {
        return {} as Record<State["name"], number>;
      }
    },
    ["state-counts"],
    {
      revalidate: 3600,
    },
  )();
}

export async function getEventCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            event: event.name,
            count: count(),
          })
          .from(competitionEvent)
          .innerJoin(event, sql`${competitionEvent.eventId} = ${event.id}`)
          .innerJoin(
            competition,
            sql`${competitionEvent.competitionId} = ${competition.id}`,
          )
          .where(
            and(
              sql`${competition.countryId} = 'Mexico'`,
              sql`${event.rank} < 200`,
            ),
          )
          .groupBy(event.name, event.rank)
          .having(gt(count(), 0))
          .orderBy(event.rank) // Changed to order by event.rank
          .then((res) =>
            res.reduce(
              (acc, { event, count }) => {
                acc[event] = count;
                return acc;
              },
              {} as Record<Event["name"], number>,
            ),
          );
      } catch (err) {
        console.error(err);
        return {} as Record<Event["name"], number>;
      }
    },
    ["event-counts"],
    {
      revalidate: 3600,
    },
  )();
}
