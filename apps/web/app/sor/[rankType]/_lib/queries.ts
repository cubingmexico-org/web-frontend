import "server-only";
import { db } from "@/db";
import { state, type State, type Event, person, rankSingle } from "@/db/schema";
import { and, count, ilike, gt, eq, sql } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { type GetSORSinglesSchema } from "./validations";
import { EXCLUDED_EVENTS } from "@/lib/constants";

export async function getSORSingles(input: GetSORSinglesSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const { data, total } = await db.transaction(async (tx) => {
          const query = sql`
          WITH "allEvents" AS (
            SELECT DISTINCT "eventId" FROM "ranksSingle"
            WHERE "eventId" NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
          ),
          "allPeople" AS (
            SELECT DISTINCT id, name FROM persons
          ),
          "peopleEvents" AS (
            SELECT "allPeople".id, "allPeople".name, "allEvents"."eventId"
            FROM "allPeople" CROSS JOIN "allEvents"
          )
          SELECT
            pe.id,
            pe.name,
            json_agg(json_build_object('eventId', pe."eventId", 'countryRank', COALESCE(rs."countryRank", wr."worstRank"))) AS events,
            SUM(COALESCE(rs."countryRank", wr."worstRank")) AS "sumOfRanks"
          FROM "peopleEvents" pe
          LEFT JOIN "ranksSingle" rs 
            ON pe.id = rs."personId" AND pe."eventId" = rs."eventId"
          LEFT JOIN (SELECT "eventId", MAX("countryRank") + 1 as "worstRank" FROM public."ranksSingle" GROUP BY "eventId") AS wr 
            ON wr."eventId" = pe."eventId"
          ${input.name ? sql`WHERE unaccent(pe.name) ILIKE unaccent(${"%" + input.name + "%"})` : sql``}
          GROUP BY pe.id, pe.name
          ORDER BY SUM(COALESCE(rs."countryRank", wr."worstRank"))
          LIMIT ${input.perPage}
          OFFSET ${offset}
        `;

          const rawData = await tx.execute(query);

          const data = rawData.rows;

          const total = (await tx
            .select({
              count: count(),
            })
            .from(person)
            .where(
              and(
                input.name ? ilike(person.name, `%${input.name}%`) : undefined,
              ),
            )
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
      tags: ["sor-single"],
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
    ["single-state-counts", eventId],
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
    ["single-gender-counts", eventId],
    {
      revalidate: 3600,
    },
  )();
}
