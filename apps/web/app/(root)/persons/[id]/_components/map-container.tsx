"use client";

import type { GeoJSONProps } from "react-leaflet";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>,
});

export function MapContainer({
  statesData,
}: {
  statesData: GeoJSONProps["data"];
}) {
  return (
    <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
      <Map posix={[23.9345, -102.5528]} statesData={statesData} />
    </div>
  );
}
