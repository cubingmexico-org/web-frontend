import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { EXCLUDED_EVENTS, SINGLE_EVENTS } from "@/lib/constants";
import { kinchRanks } from "@/db/schema";

export async function POST(): Promise<NextResponse> {
  try {
    const query = sql`
      WITH PersonalRecords AS (
        SELECT
          "personId",
          "eventId",
          MIN(best) AS personal_best,
          'average' AS type
        FROM "ranksAverage"
        WHERE "eventId" NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
        GROUP BY "personId", "eventId"
        UNION ALL
        SELECT
          "personId",
          "eventId",
          MIN(best) AS personal_best,
          'single' AS type
        FROM "ranksSingle"
        WHERE "eventId" IN (${sql.join(SINGLE_EVENTS, sql`, `)})
        GROUP BY "personId", "eventId"
      ),
      NationalRecords AS (
        SELECT
          "eventId",
          MIN(best) AS national_best,
          'average' AS type
        FROM "ranksAverage"
        WHERE "countryRank" = 1 AND "eventId" NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
        GROUP BY "eventId"
        UNION ALL
        SELECT
          "eventId",
          MIN(best) AS national_best,
          'single' AS type
        FROM "ranksSingle"
        WHERE "countryRank" = 1 AND "eventId" IN (${sql.join(SINGLE_EVENTS, sql`, `)})
        GROUP BY "eventId"
      ),
      Persons AS (
        SELECT DISTINCT "personId" FROM "ranksSingle"
      ),
      Events AS (
        SELECT id FROM "events" WHERE id NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
      ),
      Ratios AS (
        SELECT  
          p."personId",
          e.id AS "eventId",
          MAX(
            CASE 
              WHEN e.id = '333mbf' THEN
                CASE 
                  WHEN COALESCE(pr.personal_best, 0) != 0 THEN 
                    ((99 - CAST(SUBSTRING(CAST(pr.personal_best AS TEXT), 1, 2) AS FLOAT) + 
                    (1 - (CAST(SUBSTRING(CAST(pr.personal_best AS TEXT), 3, 5) AS FLOAT) / 3600))) / 
                      ((99 - CAST(SUBSTRING(CAST(nr.national_best AS TEXT), 1, 2) AS FLOAT)) + 
                      (1 - (CAST(SUBSTRING(CAST(nr.national_best AS TEXT), 3, 5) AS FLOAT) / 3600)))) * 100
                  ELSE 0
                END
              WHEN COALESCE(pr.personal_best, 0) != 0 THEN 
                (nr.national_best / COALESCE(pr.personal_best, 0)::FLOAT) * 100
              ELSE 0
            END
          ) AS best_ratio
        FROM Persons p
        CROSS JOIN Events e
        LEFT JOIN PersonalRecords pr ON p."personId" = pr."personId" AND e.id = pr."eventId"
        LEFT JOIN NationalRecords nr ON e.id = nr."eventId" AND pr.type = nr.type
        GROUP BY p."personId", e.id
      )
      SELECT 
        r."personId" as id,
        json_agg(
          json_build_object(
            'eventId', r."eventId",
            'ratio', r.best_ratio
          )
        ) AS events,
        AVG(r.best_ratio) AS overall
      FROM Ratios r
      GROUP BY r."personId"
      ORDER BY overall DESC;
    `;

    await db.transaction(async (tx) => {
      await tx.delete(kinchRanks);

      const data = await tx.execute(query);

      const persons = data.rows as {
        id: string;
        events: { eventId: string; ratio: number }[];
        overall: number;
      }[];

      persons.forEach(async (person, index) => {
        await tx.insert(kinchRanks).values({
          rank: index + 1,
          personId: person.id,
          overall: person.overall,
          events: person.events,
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
