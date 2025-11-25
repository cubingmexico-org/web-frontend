import { db } from "@/db";
import { sql } from "drizzle-orm";
import { TableCell, TableRow } from "@workspace/ui/components/table";
import { EXCLUDED_EVENTS, SINGLE_EVENTS } from "@/lib/constants";
import { cn } from "@workspace/ui/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@workspace/ui/components/tooltip";
import Link from "next/link";
import { unstable_cache } from "@/lib/unstable-cache";

export default async function Page() {
  const data = await unstable_cache(
    async () => {
      return await db.execute(
        sql`
          WITH PersonalKinch AS (
            SELECT
              p.id,
              p."stateId",
              p."name",
              pr."eventId",
              pr.type,
              CASE 
                WHEN pr."eventId" = '333mbf' THEN
                  CASE 
                    WHEN COALESCE(pr.personal_best, 0) != 0 THEN 
                      (
                        (99 - CAST(SUBSTRING(CAST(pr.personal_best AS TEXT), 1, 2) AS FLOAT)
                          + (1 - (CAST(SUBSTRING(CAST(pr.personal_best AS TEXT), 3, 5) AS FLOAT) / 3600))
                        )
                        /
                        ((99 - CAST(SUBSTRING(CAST(nr.national_best AS TEXT), 1, 2) AS FLOAT))
                          + (1 - (CAST(SUBSTRING(CAST(nr.national_best AS TEXT), 3, 5) AS FLOAT) / 3600))
                        )
                      ) * 100
                    ELSE 0
                  END
                WHEN COALESCE(pr.personal_best, 0) != 0 THEN 
                  (nr.national_best / pr.personal_best::FLOAT) * 100
                ELSE 0
              END AS best_ratio
            FROM (
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
            ) pr
            JOIN persons p ON p.id = pr."personId"
            LEFT JOIN (
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
            ) nr ON pr."eventId" = nr."eventId" AND pr.type = nr.type
          ),
          TeamKinch AS (
            SELECT
              "stateId",
              "eventId",
              best_ratio AS team_ratio,
              id AS person_id,
              "name" AS person_name
            FROM (
              SELECT
                pk.*,
                ROW_NUMBER() OVER (PARTITION BY pk."stateId", pk."eventId" ORDER BY pk.best_ratio DESC) AS rn
              FROM PersonalKinch pk
            ) sub
            WHERE rn = 1
          )
          SELECT
            t."name",
            t."stateId",
            json_agg(
              json_build_object(
                'eventId', e."id",
                'ratio', COALESCE(tk.team_ratio, 0),
                'personId', tk.person_id,
                'personName', tk.person_name
              )
              ORDER BY e."rank"
            ) AS events,
            AVG(COALESCE(tk.team_ratio, 0)) AS overall
          FROM teams t
          CROSS JOIN events e
          LEFT JOIN TeamKinch tk ON t."stateId" = tk."stateId" AND e."id" = tk."eventId"
          WHERE e."id" NOT IN (${sql.join(EXCLUDED_EVENTS, sql`, `)})
          GROUP BY t."name", t."stateId"
          ORDER BY overall DESC;
        `,
      );
    },
    ["kinch-teams-data"],
    { revalidate: 3600 },
  )();

  const teams = data.rows as {
    stateId: string;
    name: string;
    overall: number;
    events: {
      personId: string;
      personName: string;
      eventId: string;
      ratio: number;
    }[];
  }[];

  return (
    <>
      {teams.map((team, index) => (
        <TableRow key={team.stateId}>
          <TableCell>{index + 1}</TableCell>
          <TableCell className="whitespace-nowrap">
            <Link className="hover:underline" href={`/teams/${team.stateId}`}>
              {team.name}
            </Link>
          </TableCell>
          <TableCell className="font-semibold">
            {team.overall.toFixed(2)}
          </TableCell>
          {team.events.map((event) => (
            <TableCell
              key={event.eventId}
              className={cn(
                event.ratio === 0 && "text-red-500 font-semibold",
                event.ratio === 100 && "text-green-500 font-semibold",
              )}
            >
              <Tooltip>
                <TooltipTrigger>{event.ratio.toFixed(2)}</TooltipTrigger>
                {event.personName && (
                  <TooltipContent>
                    <p>{event.personName}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
