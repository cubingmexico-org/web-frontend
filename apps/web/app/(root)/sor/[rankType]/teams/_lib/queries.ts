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
              SELECT DISTINCT event_id
              FROM ranks_average
              WHERE event_id NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
            ),
            "bestPersonEvent" AS (
              SELECT DISTINCT ON (p.state_id, e.event_id)
                t.name,
                t.state_id,
                e.event_id,
                ev.rank AS event_rank,
                p.id AS person_id,
                p.name AS person_name,
                COALESCE(rs.country_rank, wr.worst_rank) AS best_rank,
                wr.worst_rank
              FROM persons p
              CROSS JOIN "allEvents" e
              JOIN events ev ON ev.id = e.event_id
              JOIN teams t ON p.state_id = t.state_id
              LEFT JOIN ranks_average rs
                ON p.id = rs.person_id AND e.event_id = rs.event_id
              LEFT JOIN (
                SELECT event_id, MAX(country_rank) + 1 AS worst_rank
                FROM public.ranks_average
                GROUP BY event_id
              ) wr
                ON wr.event_id = e.event_id
              WHERE p.state_id IS NOT NULL
              ORDER BY p.state_id, e.event_id, COALESCE(rs.country_rank, wr.worst_rank)
            )
            SELECT
              bpe.name,
              bpe.state_id,
              json_agg(
                json_build_object(
                  'eventId', bpe.event_id,
                  'eventRank', bpe.event_rank,
                  'bestRank', bpe.best_rank,
                  'personId', CASE WHEN bpe.best_rank = bpe.worst_rank THEN NULL ELSE bpe.person_id END,
                  'personName', CASE WHEN bpe.best_rank = bpe.worst_rank THEN NULL ELSE bpe.person_name END,
                  'completed', CASE WHEN bpe.best_rank = bpe.worst_rank THEN false ELSE true END
                )
                ORDER BY bpe.event_rank
              ) AS events,
              SUM(bpe.best_rank) AS overall
            FROM "bestPersonEvent" bpe
            GROUP BY bpe.name, bpe.state_id
            ORDER BY SUM(bpe.best_rank)
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
        SELECT DISTINCT event_id
        FROM ranks_single
        WHERE event_id NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
      ),
      "bestPersonEvent" AS (
        SELECT DISTINCT ON (p.state_id, e.event_id)
          t.name,
          t.state_id,
          e.event_id,
          ev.rank AS event_rank,
          p.id AS person_id,
          p.name AS person_name,
          COALESCE(rs.country_rank, wr.worst_rank) AS best_rank,
          wr.worst_rank
        FROM persons p
        CROSS JOIN "allEvents" e
        JOIN events ev ON ev.id = e.event_id
        JOIN teams t ON p.state_id = t.state_id
        LEFT JOIN ranks_single rs
          ON p.id = rs.person_id AND e.event_id = rs.event_id
        LEFT JOIN (
          SELECT event_id, MAX(country_rank) + 1 AS worst_rank
          FROM public.ranks_single
          GROUP BY event_id
        ) wr
          ON wr.event_id = e.event_id
        WHERE p.state_id IS NOT NULL
        ORDER BY p.state_id, e.event_id, COALESCE(rs.country_rank, wr.worst_rank)
      )
      SELECT
        bpe.name,
        bpe.state_id,
        json_agg(
          json_build_object(
            'eventId', bpe.event_id,
            'eventRank', bpe.event_rank,
            'bestRank', bpe.best_rank,
            'personId', CASE WHEN bpe.best_rank = bpe.worst_rank THEN NULL ELSE bpe.person_id END,
            'personName', CASE WHEN bpe.best_rank = bpe.worst_rank THEN NULL ELSE bpe.person_name END,
            'completed', CASE WHEN bpe.best_rank = bpe.worst_rank THEN false ELSE true END
          )
          ORDER BY bpe.event_rank
        ) AS events,
        SUM(bpe.best_rank) AS overall
      FROM bestPersonEvent bpe
      GROUP BY bpe.name, bpe.state_id
      ORDER BY SUM(bpe.best_rank)
    `,
    );
    return data as unknown as TeamData[];
  } catch (error) {
    console.error("Error fetching SOR teams single:", error);
    return [];
  }
}
