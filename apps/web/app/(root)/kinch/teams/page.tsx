import { db } from "@/db";
import { sql } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { EXCLUDED_EVENTS, SINGLE_EVENTS } from "@/lib/constants";
import { cn } from "@workspace/ui/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@workspace/ui/components/tooltip";
import Link from "next/link";
import { unstable_cache } from "@/lib/unstable-cache";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinch Ranks de Teams | Cubing México",
  description:
    "Encuentra el ranking de los mejores equipos de speedcubing en México en cada evento de la WCA. Filtra por estado, género y más.",
};

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
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Kinch Ranks de Teams</h1>
        <p>
          Los Kinch Ranks de teams son una forma de medir el rendimiento de un
          team en comparación con otros teams. Se calcula tomando el mejor
          resultado de cada miembro del team en cada evento y comparándolo con
          el mejor resultado nacional en ese evento. El resultado se expresa
          como un porcentaje, donde 100% significa que el team tiene el mejor
          resultado nacional en ese evento. Un porcentaje más bajo indica un
          rendimiento inferior en comparación con el mejor resultado nacional.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>
              <span className="cubing-icon event-333" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-222" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-444" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-555" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-666" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-777" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-333bf" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-333fm" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-333oh" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-clock" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-minx" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-pyram" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-skewb" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-sq1" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-444bf" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-555bf" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-333mbf" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={team.stateId}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Link
                  className="hover:underline"
                  href={`/teams/${team.stateId}`}
                >
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
        </TableBody>
      </Table>
    </main>
  );
}
