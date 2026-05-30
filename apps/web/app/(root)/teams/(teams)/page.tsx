import { Teams } from "./_components/teams";
import { getStatesGeoJSON } from "@/db/queries";
import { getTeams } from "./_lib/queries";
import type { GeoJSONProps } from "react-leaflet";

export default async function Page() {
  const [teams, statesData] = await Promise.all([
    getTeams(),
    getStatesGeoJSON(),
  ]);

  return (
    <Teams teams={teams} statesData={statesData as GeoJSONProps["data"]} />
  );
}
