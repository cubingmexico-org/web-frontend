"use client";

import type { GeoJSONProps } from "react-leaflet";
import { Skeleton } from "@workspace/ui/components/skeleton";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

const Map = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

export function MapContainer({
  locations,
  statesData,
}: {
  locations: {
    id: string;
    name: string;
    stateName: string | null;
    latitude: number | null;
    longitude: number | null;
  }[];
  statesData: GeoJSONProps["data"];
}) {
  const [showOnlyStates, setShowOnlyStates] = useState(false);

  return (
    <div className="bg-white-700 mx-auto my-5 w-[98%]">
      <div className="flex gap-2 items-center justify-start mb-2">
        <Tabs
          value={showOnlyStates ? "states" : "locations"}
          onValueChange={(value) => setShowOnlyStates(value === "states")}
        >
          <TabsList>
            <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
            <TabsTrigger value="states">Estados</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="h-[480px]">
        <Map
          posix={[23.9345, -102.5528]}
          locations={showOnlyStates ? [] : locations}
          statesData={statesData}
          showOnlyStates={showOnlyStates}
        />
      </div>
    </div>
  );
}
