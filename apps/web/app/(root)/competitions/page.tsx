import * as React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { CompetitionsTable } from "./_components/competitions-table";
import {
  getCompetitionLocations,
  getCompetitions,
  getStateCounts,
  getStatusCounts,
} from "./_lib/queries";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "./_lib/validations";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Map } from "./_components/map";
import Link from "next/link";
import { Metadata } from "next";

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
  console.log("searchParams", search.state);

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
    getStateCounts(),
    getStatusCounts(),
  ]);

  const locations = await getCompetitionLocations({
    ...search,
    filters: validFilters,
  });

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Competencias oficiales de la WCA en México
        </h1>
        <p>
          Una competencia oficial de la{" "}
          <Link
            className="hover:underline text-muted-foreground"
            href="https://www.worldcubeassociation.org/"
          >
            World Cube Association
          </Link>{" "}
          es mucho más que resolver cubos; es un evento vibrante donde los
          cuberos de todas las edades y niveles se reúnen para desafiar sus
          habilidades, compartir su pasión y establecer nuevos récords. Descubre
          competencias de velocidad, resolución a ciegas, con una sola mano y
          más. ¡Explora las fechas, ubicaciones y detalles para unirte a la
          comunidad cubera en México y vivir la emoción de la competencia!
        </p>
      </div>
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
      <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
        <Map posix={[23.9345, -102.5528]} locations={locations} />
      </div>
    </main>
  );
}
