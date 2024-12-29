/* eslint-disable @typescript-eslint/no-unused-vars */
import "server-only"
import { db } from "@/db"
import { competition, state, event, State } from "@/db/schema"
import {
  and,
  asc,
  count,
  desc,
  ilike,
  sql,
  gt,
  inArray,
} from "drizzle-orm"
import { unstable_cache } from "@/lib/unstable-cache"
import { type GetCompetitionsSchema } from "./validations"

export async function getCompetitions(input: GetCompetitionsSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage

        const where = and(
          sql`${competition.countryId} = 'Mexico'`,
          input.name ? ilike(competition.name, `%${input.name}%`) : undefined,
          input.state.length > 0
            ? inArray(state.name, input.state)
            : undefined,
        )

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) =>
              item.desc ? desc(competition[item.id]) : asc(competition[item.id])
            )
            : [asc(competition.year)]

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              id: competition.id,
              name: competition.name,
              state: state.name,
              cityName: competition.cityName,
              eventSpecs: competition.eventSpecs,
              day: competition.day,
              month: competition.month,
              year: competition.year,
              endDay: competition.endDay,
              endMonth: competition.endMonth,
            })
            .from(competition)
            .innerJoin(state, sql`${competition.stateId} = ${state.id}`)
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy)

          const total = await tx
            .select({
              count: count(),
            })
            .from(competition)
            .innerJoin(state, sql`${competition.stateId} = ${state.id}`)
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

          return {
            data,
            total,
          }
        })

        const pageCount = Math.ceil(total / input.perPage)
        return { data, pageCount }
      } catch (err) {
        return { data: [], pageCount: 0 }
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["competitions"],
    }
  )()
}

export async function getEvents() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select()
          .from(event)
          .where(sql`${event.rank} < 200`)
          .orderBy(event.rank);
      } catch (err) {
        return [];
      }
    },
    ["events"],
    {
      revalidate: 3600,
    }
  )()
}

export async function getStatesCounts() {
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
          .then((res) =>
            res.reduce(
              (acc, { state, count }) => {
                acc[state] = count
                return acc
              },
              {} as Record<State["name"], number>
            )
          )
      } catch (err) {
        return {} as Record<State["name"], number>
      }
    },
    ["competition-state-counts"],
    {
      revalidate: 3600,
    }
  )()
}
