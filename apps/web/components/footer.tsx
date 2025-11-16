import { db } from "@/db";
import { competition, result } from "@/db/schema";
import { Discord, Facebook, GitHub, Instagram } from "@workspace/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { desc, eq, isNull, lt, and, notInArray } from "drizzle-orm";
import { Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

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
      <div className="container px-5 py-8 mx-auto">
        <div className="flex items-center sm:flex-row flex-col">
          <Link
            className="flex title-font font-medium items-center md:justify-start justify-center text-primary"
            href="https://github.com/cubingmexico-org"
          >
            <span className="flex gap-2 items-center ml-3 text-xl">
              <GitHub className="size-6" />
              Cubing México
            </span>
          </Link>
          <p className="text-sm text-muted-foreground sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            <span>
              © {new Date().getFullYear()} Cubing México —
              <Link
                className="text-muted-foreground ml-1"
                href="https://instagram.com/cubingmexico"
                rel="noopener noreferrer"
                target="_blank"
              >
                @cubingmexico
              </Link>
            </span>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start gap-3">
            <Link
              href="https://facebook.com/cubingmexico"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com/cubingmexico"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://discord.gg/cubingmexico"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Discord className="h-5 w-5" />
            </Link>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <p className="inline-flex justify-center sm:justify-start flex-col sm:flex-row sm:items-center gap-2 text-sm">
            <span className="text-muted-foreground flex items-center">
              <Trophy className="h-4 w-4 mr-1" />
              Último: {lastCompetitionWithResults[0]?.name}
            </span>
            {competitionsWithNoResults.length > 0 && (
              <>
                <span className="hidden sm:inline text-gray-300 text-sm">
                  •
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-muted-foreground flex items-center">
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
              </>
            )}
          </p>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>
            Hecho con ❤️ por{" "}
            <Link
              href="https://www.worldcubeassociation.org/persons/2016TORO03"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leonardo Sánchez Del Toro
            </Link>
          </p>
        </div>
        <div className="flex justify-center sm:justify-end pt-4">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
