"use cache";

import "server-only";
import { db } from "@/db";
import { EXCLUDED_EVENTS } from "@/lib/constants";
import { sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

interface TeamData {
  stateId: string;
  name: string;
  overall: number;
  events: {
    eventId: string;
    bestRank: number;
    personId: string | null;
    personName: string | null;
    completed: boolean;
  }[];
}

export async function getSORTeamsAverage(): Promise<TeamData[]> {
  cacheLife("hours");
  cacheTag("sor-teams-average");

  try {
    const data = await db.execute(
      sql`
            WITH "allEvents" AS (
              SELECT DISTINCT "eventId"
              FROM "ranksAverage"
              WHERE "eventId" NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
            ),
            "bestPersonEvent" AS (
              SELECT DISTINCT ON (p."stateId", e."eventId")
                t."name",
                t."stateId",
                e."eventId",
                ev."rank" AS "eventRank",
                p.id AS "personId",
                p."name" AS "personName",
                COALESCE(rs."countryRank", wr."worstRank") AS "bestRank",
                wr."worstRank"
              FROM persons p
              CROSS JOIN "allEvents" e
              JOIN events ev ON ev.id = e."eventId"
              JOIN teams t ON p."stateId" = t."stateId"
              LEFT JOIN "ranksAverage" rs
                ON p.id = rs."personId" AND e."eventId" = rs."eventId"
              LEFT JOIN (
                SELECT "eventId", MAX("countryRank") + 1 AS "worstRank"
                FROM public."ranksAverage"
                GROUP BY "eventId"
              ) wr
                ON wr."eventId" = e."eventId"
              WHERE p."stateId" IS NOT NULL
              ORDER BY p."stateId", e."eventId", COALESCE(rs."countryRank", wr."worstRank")
            )
            SELECT
              bpe."name",
              bpe."stateId",
              json_agg(
                json_build_object(
                  'eventId', bpe."eventId",
                  'eventRank', bpe."eventRank",
                  'bestRank', bpe."bestRank",
                  'personId', CASE WHEN bpe."bestRank" = bpe."worstRank" THEN NULL ELSE bpe."personId" END,
                  'personName', CASE WHEN bpe."bestRank" = bpe."worstRank" THEN NULL ELSE bpe."personName" END,
                  'completed', CASE WHEN bpe."bestRank" = bpe."worstRank" THEN false ELSE true END
                )
                ORDER BY bpe."eventRank"
              ) AS events,
              SUM(bpe."bestRank") AS overall
            FROM "bestPersonEvent" bpe
            GROUP BY bpe."name", bpe."stateId"
            ORDER BY SUM(bpe."bestRank")
          `,
    );

    return data as unknown as TeamData[];
  } catch (error) {
    console.error("Error fetching SOR teams average:", error);
    return [];
  }
}

export async function getSORTeamsSingle(): Promise<TeamData[]> {
  cacheLife("hours");
  cacheTag("sor-teams-single");

  try {
    const data = await db.execute(
      sql`
      WITH "allEvents" AS (
        SELECT DISTINCT "eventId"
        FROM "ranksSingle"
        WHERE "eventId" NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
      ),
      "bestPersonEvent" AS (
        SELECT DISTINCT ON (p."stateId", e."eventId")
          t."name",
          t."stateId",
          e."eventId",
          ev."rank" AS "eventRank",
          p.id AS "personId",
          p."name" AS "personName",
          COALESCE(rs."countryRank", wr."worstRank") AS "bestRank",
          wr."worstRank"
        FROM persons p
        CROSS JOIN "allEvents" e
        JOIN events ev ON ev.id = e."eventId"
        JOIN teams t ON p."stateId" = t."stateId"
        LEFT JOIN "ranksSingle" rs
          ON p.id = rs."personId" AND e."eventId" = rs."eventId"
        LEFT JOIN (
          SELECT "eventId", MAX("countryRank") + 1 AS "worstRank"
          FROM public."ranksSingle"
          GROUP BY "eventId"
        ) wr
          ON wr."eventId" = e."eventId"
        WHERE p."stateId" IS NOT NULL
        ORDER BY p."stateId", e."eventId", COALESCE(rs."countryRank", wr."worstRank")
      )
      SELECT
        bpe."name",
        bpe."stateId",
        json_agg(
          json_build_object(
            'eventId', bpe."eventId",
            'eventRank', bpe."eventRank",
            'bestRank', bpe."bestRank",
            'personId', CASE WHEN bpe."bestRank" = bpe."worstRank" THEN NULL ELSE bpe."personId" END,
            'personName', CASE WHEN bpe."bestRank" = bpe."worstRank" THEN NULL ELSE bpe."personName" END,
            'completed', CASE WHEN bpe."bestRank" = bpe."worstRank" THEN false ELSE true END
          )
          ORDER BY bpe."eventRank"
        ) AS events,
        SUM(bpe."bestRank") AS overall
      FROM "bestPersonEvent" bpe
      GROUP BY bpe."name", bpe."stateId"
      ORDER BY SUM(bpe."bestRank")
    `,
    );
    return data as unknown as TeamData[];
  } catch (error) {
    console.error("Error fetching SOR teams single:", error);
    return [];
  }
}
