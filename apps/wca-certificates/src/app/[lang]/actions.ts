/* eslint-disable @typescript-eslint/no-unsafe-member-access -- . */
/* eslint-disable @typescript-eslint/no-unsafe-call -- . */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
/* eslint-disable @typescript-eslint/no-unsafe-return -- . */

import type { Competition as CompetitionWCALive } from "@/types/wca-live";
import type { Competition } from "@/types/competitions";

export async function fetchCompetitions(token: string): Promise<Competition[]> {
  const res = await fetch('https://www.worldcubeassociation.org/api/v0/competitions?managed_by_me=true', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json();
}

export async function fetchCompetition(competitionId: string): Promise<CompetitionWCALive> {
  const res = await fetch(`https://worldcubeassociation.org/api/v0/competitions/${competitionId}/wcif/public`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json();
}

export async function retrieveLocation(lat: number, lng: number): Promise<{ city: string, state: string}> {
  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`, {
    cache: 'no-store'
  });

  const locationData = await res.json();
  const addressComponents = locationData.results[0].address_components;
  const cityObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('locality'));
  const stateObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_1'));

  return { city: cityObj.long_name, state: stateObj.long_name };
}