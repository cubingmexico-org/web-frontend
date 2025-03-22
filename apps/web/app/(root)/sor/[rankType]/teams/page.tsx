import { db } from "@/db";
import { sql } from "drizzle-orm";
import { SearchParams } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { EXCLUDED_EVENTS } from "@/lib/constants";
import { cn } from "@workspace/ui/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@workspace/ui/components/tooltip";

interface PageProps {
  params: Promise<{ rankType: "single" | "average" }>;
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  // const searchParams = await props.searchParams;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rankType = (await props.params).rankType;

  // Execute your query as before
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
          e."eventId",
          ev."rank" AS "eventRank",
          p.id AS "personId",
          p."name" AS "personName",
          COALESCE(rs."countryRank", wr."worstRank") AS "bestRank"
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
        json_agg(
          json_build_object(
            'eventId', bpe."eventId",
            'eventRank', bpe."eventRank",
            'bestRank', bpe."bestRank",
            'personId', bpe."personId",
            'personName', bpe."personName",
            'completed', CASE WHEN bpe."bestRank" IS NULL THEN false ELSE true END
          )
          ORDER BY bpe."eventRank"
        ) AS events,
        SUM(bpe."bestRank") AS overall
      FROM "bestPersonEvent" bpe
      GROUP BY bpe."name"
      ORDER BY SUM(bpe."bestRank")
    `,
  );

  const teams = data.rows as {
    name: string;
    overall: number;
    events: {
      eventId: string;
      bestRank: number;
      personId: string;
      personName: string;
      completed: boolean;
    }[];
  }[];

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">States</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estado</TableHead>
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
          {teams.map((team) => (
            <TableRow key={team.name}>
              <TableCell>{team.name}</TableCell>
              <TableCell className="font-semibold">{team.overall}</TableCell>
              {team.events.map((event) => (
                <TableCell
                  className={cn(
                    event.bestRank <= 10 && "text-green-500 font-semibold",
                    !event.completed && "text-red-500 font-semibold",
                  )}
                  key={event.eventId}
                >
                  <Tooltip>
                    <TooltipTrigger>{event.bestRank}</TooltipTrigger>
                    <TooltipContent>
                      <p>{event.personName}</p>
                    </TooltipContent>
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
