import "server-only";
import { db } from "@/db";
import {
  competition,
  state,
  event,
  State,
  Event,
  competitionEvent,
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
import { type GetCompetitionsSchema } from "./validations";

export async function getCompetitions(input: GetCompetitionsSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;
        const fromDate = input.from ? new Date(input.from) : undefined;
        const toDate = input.to ? new Date(input.to) : undefined;

        const where = and(
          sql`${competition.countryId} = 'Mexico'`,
          input.name ? ilike(competition.name, `%${input.name}%`) : undefined,
          input.state.length > 0 ? inArray(state.name, input.state) : undefined,
          input.events.length > 0
            ? inArray(event.name, input.events)
            : undefined,
          fromDate ? gte(competition.startDate, fromDate) : undefined,
          toDate ? lte(competition.endDate, toDate) : undefined,
        );

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) =>
                item.desc
                  ? desc(competition[item.id])
                  : asc(competition[item.id]),
              )
            : [asc(competition.startDate)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              id: competition.id,
              name: competition.name,
              state: state.name,
              startDate: competition.startDate,
              endDate: competition.endDate,
              events: sql`array_agg(${event.id} ORDER BY ${event.rank})`.as(
                "events",
              ),
            })
            .from(competition)
            .leftJoin(state, sql`${competition.stateId} = ${state.id}`)
            .leftJoin(
              competitionEvent,
              sql`${competition.id} = ${competitionEvent.competitionId}`,
            )
            .leftJoin(event, sql`${competitionEvent.eventId} = ${event.id}`)
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .groupBy(
              competition.id,
              state.name,
              competition.startDate,
              competition.endDate,
            )
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: sql`COUNT(DISTINCT ${competition.id})`.as("count"),
            })
            .from(competition)
            .leftJoin(state, sql`${competition.stateId} = ${state.id}`)
            .leftJoin(
              competitionEvent,
              sql`${competition.id} = ${competitionEvent.competitionId}`,
            )
            .leftJoin(event, sql`${competitionEvent.eventId} = ${event.id}`)
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
        console.error(err);
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
