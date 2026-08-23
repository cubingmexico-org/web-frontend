"use cache";

import "server-only";
import { db } from "@workspace/db";
import { competition, result } from "@workspace/db/schema";
import { countDistinct, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getCompetitionsPageData(stateId: string) {
  cacheLife("days");
  cacheTag(`team-competitions-${stateId}`);

  const competitorCounts = db
    .select({
      competitionId: result.competitionId,
      competitorCount: countDistinct(result.personId).as("competitor_count"),
    })
    .from(result)
    .groupBy(result.competitionId)
    .as("competitor_counts");

  const competitions = await db
    .select({
      id: competition.id,
      name: competition.name,
      logo: competition.logo,
      cityName: competition.cityName,
      venue: competition.venue,
      startDate: competition.startDate,
      endDate: competition.endDate,
      latitudeMicrodegrees: competition.latitudeMicrodegrees,
      longitudeMicrodegrees: competition.longitudeMicrodegrees,
      competitorCount: competitorCounts.competitorCount,
    })
    .from(competition)
    .leftJoin(
      competitorCounts,
      eq(competition.id, competitorCounts.competitionId),
    )
    .where(eq(competition.stateId, stateId))
    .orderBy(competition.startDate);

  return {
    competitions,
    upcomingCompetitions: competitions.filter(
      (competition) => competition.startDate >= new Date(),
    ),
    pastCompetitions: competitions.filter(
      (competition) => competition.endDate < new Date(),
    ),
  };
}
