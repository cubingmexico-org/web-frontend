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
      <h1 className="text-3xl font-bold mb-6">Organizadores</h1>
      <div className="grid gap-6">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
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
