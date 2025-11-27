"use cache";

import "server-only";
import { db } from "@/db";
import { EXCLUDED_EVENTS, SINGLE_EVENTS } from "@/lib/constants";
import { sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

interface KinchRanksState {
  id: string;
  name: string;
  events: { eventId: string; ratio: number }[];
  overall: number;
}

export async function getKinchRanksState(
  stateId: string,
): Promise<KinchRanksState[]> {
  cacheLife("hours");
  cacheTag("kinch-ranks-state");

  try {
    const data = await db.execute(sql`
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
              StateRecords AS (
                SELECT
                  r."eventId",
                  MIN(r.best) AS state_best,
                  'average' AS type
                FROM "ranksAverage" r
                JOIN "persons" p ON r."personId" = p.id
                WHERE r."stateRank" = 1
                  AND p."stateId" = ${stateId}
                  AND r."eventId" NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
                GROUP BY r."eventId"
                UNION ALL
                SELECT
                  r."eventId",
                  MIN(r.best) AS state_best,
                  'single' AS type
                FROM "ranksSingle" r
                JOIN "persons" p ON r."personId" = p.id
                WHERE r."stateRank" = 1
                  AND p."stateId" = ${stateId}
                  AND r."eventId" IN (${sql.join(SINGLE_EVENTS, sql`, `)})
                GROUP BY r."eventId"
              ),
              Persons AS (
                SELECT 
                  id AS "personId",
                  name
                FROM "persons"
                WHERE "stateId" = ${stateId}
              ),
              Events AS (
                SELECT id, rank
                FROM "events"
                WHERE id NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
              ),
              Ratios AS (
                SELECT  
                  p."personId",
                  e.id AS "eventId",
                  e.rank,
                  MAX(
                    CASE 
                      WHEN e.id = '333mbf' THEN
                        CASE 
                          WHEN COALESCE(pr.personal_best, 0) != 0 THEN 
                            ((99 - CAST(SUBSTRING(CAST(pr.personal_best AS TEXT), 1, 2) AS FLOAT) + 
                              (1 - (CAST(SUBSTRING(CAST(pr.personal_best AS TEXT), 3, 5) AS FLOAT) / 3600))) / 
                            ((99 - CAST(SUBSTRING(CAST(sr.state_best AS TEXT), 1, 2) AS FLOAT)) + 
                              (1 - (CAST(SUBSTRING(CAST(sr.state_best AS TEXT), 3, 5) AS FLOAT) / 3600)))
                            ) * 100
                          ELSE 0
                        END
                      WHEN COALESCE(pr.personal_best, 0) != 0 THEN 
                        (sr.state_best / COALESCE(pr.personal_best, 0)::FLOAT) * 100
                      ELSE 0
                    END
                  ) AS best_ratio
                FROM Persons p
                CROSS JOIN Events e
                LEFT JOIN PersonalRecords pr ON p."personId" = pr."personId" AND e.id = pr."eventId"
                LEFT JOIN StateRecords sr ON e.id = sr."eventId" AND pr.type = sr.type
                GROUP BY p."personId", e.id, e.rank
              )
              SELECT 
                p."personId" AS id,
                p.name,
                json_agg(
                  json_build_object(
                    'eventId', r."eventId",
                    'ratio', r.best_ratio
                  )
                  ORDER BY r.rank
                ) AS events,
                AVG(r.best_ratio) AS overall
              FROM Ratios r
              JOIN Persons p ON r."personId" = p."personId"
              GROUP BY p."personId", p.name
              ORDER BY overall DESC;
            `);

    const persons = data as unknown as KinchRanksState[];

    return persons;
  } catch (err) {
    console.error(err);
    return [];
  }
}
