import type { Competition as CompetitionWCALive } from "@/types/wca-live";
import type { Competition } from "@/types/competitions";

export async function fetchCompetitions(token: string): Promise<Competition[]> {
  const res = await fetch(
    "https://www.worldcubeassociation.org/api/v0/competitions?managed_by_me=true",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function fetchCompetition(
  competitionId: string,
): Promise<CompetitionWCALive> {
  const res = await fetch(
    `https://worldcubeassociation.org/api/v0/competitions/${competitionId}/wcif/public`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function retrieveLocation(competitionId: string): Promise<string> {
  const res = await fetch(
    `https://www.worldcubeassociation.org/api/v0/competitions/${competitionId}`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();

  return data.city;
}
