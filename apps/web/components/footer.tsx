import { db } from "@/db";
import { competition, result } from "@/db/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { desc, eq, isNull, lt, and, notInArray } from "drizzle-orm";
import { Clock, Trophy } from "lucide-react";
import Link from "next/link";

export async function Footer() {
  const lastCompetitionWithResults = await db
    .select({
      name: competition.name,
    })
    .from(competition)
    .innerJoin(result, eq(competition.id, result.competitionId))
    .where(eq(competition.countryId, "Mexico"))
    .orderBy(desc(competition.endDate))
    .limit(1);

  const competitionsWithNoResults = await db
    .select({
      name: competition.name,
    })
    .from(competition)
    .leftJoin(result, eq(competition.id, result.competitionId))
    .where(
      and(
        eq(competition.countryId, "Mexico"),
        lt(competition.endDate, new Date()),
        isNull(result.competitionId),
        notInArray(competition.id, ["PerryOpen2013", "ChapingoOpen2020"]),
      ),
    );

  return (
    <footer className="text-muted-foreground body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <Link
          className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
          href="/"
        >
          <span className="ml-3 text-xl">Cubing México</span>
        </Link>
        <p className="text-sm text-muted-foreground sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © {new Date().getFullYear()} Cubing México —
          <a
            className="text-muted-foreground ml-1"
            href="https://instagram.com/cubingmexico"
            rel="noopener noreferrer"
            target="_blank"
          >
            @cubingmexico
          </a>
        </p>
        <p className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start flex-col sm:flex-row sm:items-center gap-2 text-sm">
          <span className="text-gray-500 flex items-center">
            <Trophy className="h-4 w-4 mr-1" />
            Último: {lastCompetitionWithResults[0]?.name}
          </span>
          <span className="hidden sm:inline text-gray-300 text-sm">•</span>
          {competitionsWithNoResults.length > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <span className="text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Resultados pendientes ({competitionsWithNoResults.length})
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {competitionsWithNoResults.map((competition) => (
                  <p key={competition.name}>{competition.name}</p>
                ))}
              </TooltipContent>
            </Tooltip>
          )}
        </p>
      </div>
    </footer>
  );
}
