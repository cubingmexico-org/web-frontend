import { db } from "@/db";
import { EXCLUDED_EVENTS, SINGLE_EVENTS } from "@/lib/constants";
import { SearchParams } from "@/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { StateSelector } from "./_components/state-selector";
import { getStates } from "@/db/queries";
import { unstable_cache } from "@/lib/unstable-cache";
import { Metadata } from "next";
import { getTeam } from "@/db/queries";

type Props = {
  params: Promise<{ stateId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stateId = (await params).stateId;

  const team = await getTeam(stateId);

  return {
    title: `Kinch Ranks de ${team?.state} | Cubing México`,
    description: `Encuentra el ranking del ${team?.name} de speedcubing en México en cada evento de la WCA. Filtra por estado, género y más.`,
  };
}
export default async function Page(props: {
  params: Promise<{ stateId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const stateId = (await props.params).stateId;

  const persons = await unstable_cache(
    async () => {
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

        const persons = data.rows as {
          id: string;
          name: string;
          events: { eventId: string; ratio: number }[];
          overall: number;
        }[];

        return persons;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [stateId],
    {
      revalidate: 3600,
      tags: ["state-kinch-ranks"],
    },
  )();

  const states = await getStates();

  const stateName = states.find((state) => state.id === stateId)?.name;

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Kinch Ranks estatales de {stateName}
        </h1>
        <p>
          Los Kinch Ranks son un sistema de clasificación innovador diseñado
          para evaluar la habilidad de un cubero en los 17 eventos oficiales de
          la WCA. Este sistema utiliza un enfoque único para calcular la
          puntuación de cada competidor en función de sus resultados en cada
          evento. Cada evento se puntúa en una escala del 0 al 100, considerando
          tanto los{" "}
          <Link
            className="text-muted-foreground hover:underline"
            href={`/records/${stateId}`}
          >
            récords estatales (SR)
          </Link>{" "}
          como los récords personales (PR) de los competidores. A través de este
          enfoque, se busca equilibrar la clasificación entre todos los eventos,
          eliminando las desventajas percibidas en sistemas tradicionales como
          el{" "}
          <Link
            className="text-muted-foreground hover:underline"
            href="/sor/single"
          >
            SOR
          </Link>{" "}
          y promoviendo una visión más integral de las habilidades en la
          resolución de rompecabezas.
        </p>
        <StateSelector states={states} stateName={stateName!} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nombre</TableHead>
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
          {persons.map((person, index) => (
            <TableRow key={person.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Link
                  className="hover:underline"
                  href={`/persons/${person.id}`}
                >
                  {person.name}
                </Link>
              </TableCell>
              <TableCell className="font-semibold">
                {person.overall.toFixed(2)}
              </TableCell>
              {person.events.map((event) => (
                <TableCell
                  key={event.eventId}
                  className={cn(
                    event.ratio === 0 && "text-red-500 font-semibold",
                    event.ratio === 100 && "text-green-500 font-semibold",
                  )}
                >
                  {event.ratio.toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
