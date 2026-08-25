import { WCIF_VERSION } from "@/types/wcif";

export { WCIF_VERSION };

export const WCA_API_BASE = "https://www.worldcubeassociation.org/api/v0";

export function wcifLatestUrl(competitionId: string): string {
  return `${WCA_API_BASE}/competitions/${competitionId}/wcif/latest`;
}

export function wcifCheckUrl(): string {
  return `${WCA_API_BASE}/competitions/wcif/check`;
}

export function wcifPatchUrl(competitionId: string): string {
  return `${WCA_API_BASE}/competitions/${competitionId}/wcif`;
}
