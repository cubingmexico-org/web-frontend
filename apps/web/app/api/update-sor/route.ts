import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { EXCLUDED_EVENTS } from "@/lib/constants";
import { sumOfRanks } from "@/db/schema";

export async function POST(): Promise<NextResponse> {
  try {
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
        json_agg(
          json_build_object(
            'eventId', pe."eventId",
            'countryRank', COALESCE(rs."countryRank", wr."worstRank"),
            'completed', CASE WHEN rs."countryRank" IS NULL THEN false ELSE true END
          )
        ) AS events,
        SUM(COALESCE(rs."countryRank", wr."worstRank")) AS "overall"
      FROM "peopleEvents" pe
      LEFT JOIN "ranksSingle" rs 
        ON pe.id = rs."personId" AND pe."eventId" = rs."eventId"
      LEFT JOIN (SELECT "eventId", MAX("countryRank") + 1 as "worstRank" FROM public."ranksSingle" GROUP BY "eventId") AS wr 
        ON wr."eventId" = pe."eventId"
      GROUP BY pe.id, pe.name
      ORDER BY SUM(COALESCE(rs."countryRank", wr."worstRank"))
    `;

    await db.transaction(async (tx) => {
      const data = await tx.execute(query);

      const persons = data.rows as {
        id: string;
        name: string;
        events: { eventId: string; countryRank: number; completed: boolean }[];
        overall: number;
      }[];

      persons.forEach(async (person, index) => {
        await tx
          .insert(sumOfRanks)
          .values({
            regionRank: index + 1,
            personId: person.id,
            resultType: "single",
            overall: person.overall,
            events: person.events,
          })
          .onConflictDoUpdate({
            target: [sumOfRanks.personId, sumOfRanks.resultType],
            set: {
              regionRank: index + 1,
              overall: person.overall,
              events: person.events,
            },
          });
      });
    });

    return NextResponse.json({
      success: true,
      message: "Database updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error updating database" },
      { status: 500 },
    );
  }
}
