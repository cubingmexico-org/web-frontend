/* eslint-disable @typescript-eslint/no-unsafe-call -- . */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- . */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
import { Badge } from "@repo/ui/badge";
import DocumentSettings from "@/app/certificates/podium/[competitionId]/_components/document-settings"
import { generateFakeResultsForEvent } from "@/lib/utils";
import type { Competition } from "@/types/wca-live";
import "@cubing/icons"

export default async function Page({ params }: { params: { competitionId: string } }): Promise<JSX.Element> {

  const response = await fetch(`https://worldcubeassociation.org/api/v0/competitions/${params.competitionId}/wcif/public`, {
    cache: 'no-store'
  });

  const competition = await response.json() as Competition;
  
  competition.events = competition.events.map((event) => generateFakeResultsForEvent(event));

  const locationResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${competition.schedule.venues[0].latitudeMicrodegrees / 1000000},${competition.schedule.venues[0].longitudeMicrodegrees / 1000000}&key=${process.env.GOOGLE_MAPS_API_KEY}`, {
    cache: 'no-store'
  });

  const locationData = await locationResponse.json();
  const addressComponents = locationData.results[0].address_components;
  const cityObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('locality'));
  const stateObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_1'));

  return (
    <div className="container flex flex-col gap-2 mx-auto py-10">
      <div className="flex gap-2">
        <h1 className="text-3xl">Certificados de podio para el {competition.name}</h1><Badge className="text-lg" variant='destructive'>Diseño</Badge>
      </div>
      <DocumentSettings city={cityObj.long_name} competition={competition} state={stateObj.long_name} />
    </div>
  );
}
