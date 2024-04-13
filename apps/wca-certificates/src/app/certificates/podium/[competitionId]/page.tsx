import DownloadButton from "@/components/download-button-podium"
import type { Data } from "@/types/types";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import "@cubing/icons"


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Return type is inferred
export default async function Page({ params }: { params: { competitionId: string } }) {

  const response = await fetch(`https://worldcubeassociation.org/api/v0/competitions/${params.competitionId}/wcif/public`, {
    cache: 'no-store'
  });

  const data = await response.json() as Data;

  const locationResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.schedule.venues[0].latitudeMicrodegrees/1000000},${data.schedule.venues[0].longitudeMicrodegrees/1000000}&key=${process.env.GOOGLE_MAPS_API_KEY}`, {
    cache: 'no-store'
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is the expected assignment
  const locationData = await locationResponse.json();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- This is the expected assignment
  const addressComponents = locationData.results[0].address_components;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- This is the expected assignment
  const cityObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('locality'));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- This is the expected assignment
  const stateObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_1'));

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl mb-4">Certificados de podio para el {data.name}</h1>
      <DataTable columns={columns} data={data.events} />
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- . */}
      <DownloadButton city={cityObj.long_name} data={data} state={stateObj.long_name} />
    </div>
  );
}
