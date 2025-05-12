import * as React from "react";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PersonsTable } from "./_components/organisers-table";
import {
  getOrganiserStatusCounts,
  getPersons,
  getPersonsGenderCounts,
  getPersonsStateCounts,
} from "./_lib/queries";
import { getValidFilters } from "@/lib/data-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizadores | Cubing México",
  description:
    "Encuentra el directorio de todos los organizadores mexicanos de la WCA. Filtra por estado, género y más.",
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getPersons({
      ...search,
      filters: validFilters,
    }),
    getPersonsStateCounts(),
    getPersonsGenderCounts(),
    getOrganiserStatusCounts(),
  ]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Organizadores</h1>
        <p>
          Directorio de todos los organizadores de competencias de la WCA en
          México.
        </p>
      </div>
      <div className="grid gap-6">
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
          <PersonsTable promises={promises} />
        </React.Suspense>
      </div>
    </main>
  );
}
