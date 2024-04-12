import { Event, columns } from "./columns"
import { DataTable } from "./data-table"
import "@cubing/icons"
import DownloadButton from "@/components/download-button-podium"

export default async function Page({ params }: { params: { competitionId: string } }) {

  const response = await fetch(`https://worldcubeassociation.org/api/v0/competitions/${params.competitionId}/wcif/public`, {
    cache: 'no-store'
  });

  const data = await response.json();

  const location_response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.schedule.venues[0].latitudeMicrodegrees/1000000},${data.schedule.venues[0].longitudeMicrodegrees/1000000}&key=${process.env.GOOGLE_MAPS_API_KEY}`, {
    cache: 'no-store'
  });

  const location_data = await location_response.json();
  const addressComponents = location_data.results[0].address_components;
  const cityObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('locality'));
  const stateObj = addressComponents.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_1'));

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl mb-4">Certificados de podio para el {data.name}</h1>
      <DataTable columns={columns} data={data.events} />
      <DownloadButton data={data} city={cityObj.long_name} state={stateObj.long_name} />
    </div>
  );
}
