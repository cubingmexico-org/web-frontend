"use cache";

import "server-only";
import type { Competition } from "@/types/wca";
import { cacheLife, cacheTag } from "next/cache";

export async function getWcaCompetitionData(
  competitionId: string,
): Promise<Competition | null> {
  cacheLife("days");
  cacheTag(`wca-competition-data-${competitionId}`);

  try {
    const response = await fetch(
      `https://www.worldcubeassociation.org/api/v0/competitions/${competitionId}`,
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
