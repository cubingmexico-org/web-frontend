import type { WCIF } from "@/types/wcif";
import type { Competition } from "@/types/wca";

export async function getCompetitionsManagedByUser({
  token,
}: {
  token: string | undefined;
}): Promise<Competition[]> {
  try {
    const res = await fetch(
      "https://www.worldcubeassociation.org/api/v0/competitions?managed_by_me=true",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return [];
  }
}

export async function getWCIFByCompetitionId({
  competitionId,
}: {
  competitionId: string;
}): Promise<WCIF | undefined> {
  try {
    const res = await fetch(
      `https://worldcubeassociation.org/api/v0/competitions/${competitionId}/wcif/public`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching competition:", error);
    return undefined;
  }
}

export async function getCompetitionById({
  id,
}: {
  id: string;
}): Promise<Competition | undefined> {
  try {
    const res = await fetch(
      `https://www.worldcubeassociation.org/api/v0/competitions/${id}`,
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching location:", error);
    return undefined;
  }
}
