import * as React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { CompetitionsTable } from "./_components/competitions-table";
import {
  getCompetitions,
  getCompetitionsLocations,
  getCompetitionsStateCounts,
  getCompetitionsStatusCounts,
} from "./_lib/queries";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "./_lib/validations";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Metadata } from "next";
import { MapContainer } from "./_components/map-container";
import type { GeoJSONProps } from "react-leaflet";
import { getStatesGeoJSON } from "@/db/queries";
import { headers } from "next/headers";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const search = await searchParams;

  return {
    title: `Competencias ${search.state ? `en ${search.state} ` : ""}| Cubing México`,
    description:
      "Encuentra competencias oficiales de la WCA en México y conéctate con otros cuberos.",
  };
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getCompetitions({
      ...search,
      filters: validFilters,
    }),
    getCompetitionsStateCounts(),
    getCompetitionsStatusCounts(),
  ]);

  const locations = await getCompetitionsLocations({
    ...search,
    filters: validFilters,
  });

  const headersList = await headers();
  const domain = headersList.get("host");
  const isProduction = process.env.NODE_ENV === "production";

  const statesData = await getStatesGeoJSON(
    isProduction ? `https://${domain}` : `http://${domain}`,
  );

  const statesIds = Array.from(
    new Set(locations.map((location) => location.stateId)),
  );

  const filteredStatesData = statesData?.features.filter((feature) =>
    statesIds?.includes(feature.properties.id),
  ) as unknown as GeoJSONProps["data"];

  return (
    <>
      <div className="grid gap-6">
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
            shallow={false}
          />
        </React.Suspense>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                "10rem",
                "30rem",
                "10rem",
                "10rem",
                "6rem",
                "6rem",
                "6rem",
              ]}
              shrinkZero
            />
          }
        >
          <CompetitionsTable promises={promises} />
        </React.Suspense>
      </div>
      <MapContainer locations={locations} statesData={filteredStatesData} />
    </>
  );
}
