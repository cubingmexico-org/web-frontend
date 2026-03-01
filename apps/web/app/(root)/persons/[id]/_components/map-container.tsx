"use client";

import type { GeoJSONProps } from "react-leaflet";
import dynamic from "next/dynamic";
import { Skeleton } from "@workspace/ui/components/skeleton";

const LeafletMap = dynamic(
  () => import("@/components/leaflet-map").then((mod) => mod.LeafletMap),
  { ssr: false, loading: () => <Skeleton className="w-full h-full" /> },
);

export function MapContainer({
  statesData,
}: {
  statesData: GeoJSONProps["data"];
}) {
  return (
    <div className="bg-white-700 mx-auto my-5 w-[98%] h-120">
      <LeafletMap posix={[23.9345, -102.5528]} statesData={statesData} />
    </div>
  );
}
