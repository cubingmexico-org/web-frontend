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
          href="https://github.com/cubingmexico-org"
        >
          <span className="flex gap-2 items-center ml-3 text-xl">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Cubing México
          </span>
        </Link>
        <p className="flex flex-col text-sm text-muted-foreground sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          <span>
            © {new Date().getFullYear()} Cubing México —
            <a
              className="text-muted-foreground ml-1"
              href="https://instagram.com/cubingmexico"
              rel="noopener noreferrer"
              target="_blank"
            >
              @cubingmexico
            </a>
          </span>
          <span className="text-xs text-center sm:text-left">
            Hecho por{" "}
            <Link
              className="hover:underline"
              href="https://www.worldcubeassociation.org/persons/2016TORO03"
            >
              Leonardo Sánchez Del Toro
            </Link>
          </span>
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
