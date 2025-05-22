"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>,
});

export function MapContainer({
  locations,
}: {
  locations: {
    id: string;
    name: string;
    state: string | null;
    latitutude: number | null;
    longitude: number | null;
  }[];
}) {
  return (
    <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
      <Map posix={[23.9345, -102.5528]} locations={locations} />
    </div>
  );
}
