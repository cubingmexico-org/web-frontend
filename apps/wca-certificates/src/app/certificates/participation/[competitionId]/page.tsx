/* eslint-disable @typescript-eslint/no-unsafe-call -- . */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- . */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
import DocumentSettings from "@/components/participation/document-settings"
import type { Competition } from "@/types/wca-live"
import "@cubing/icons"

export default async function Page({ params }: { params: { competitionId: string } }): Promise<JSX.Element> {

  const response = await fetch(`https://worldcubeassociation.org/api/v0/competitions/${params.competitionId}/wcif/public`, {
    cache: 'no-store'
  });

  const data = await response.json() as Competition;

  const locationResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.schedule.venues[0].latitudeMicrodegrees/1000000},${data.schedule.venues[0].longitudeMicrodegrees/1000000}&key=${process.env.GOOGLE_MAPS_API_KEY}`, {
    cache: 'no-store'
  });

  const locationData = await locationResponse.json();
  const addressComponents = locationData.results[0].address_components;
  const cityObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('locality'));
  const stateObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_1'));

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl mb-4">Certificados de participación para el {data.name}</h1>
      <DocumentSettings city={cityObj.long_name} competition={data} state={stateObj.long_name} />
    </div>
  );
}
