import * as React from "react"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { CompetitionsTable } from "./_components/competitions-table";
import {
  getCompetitions,
  getStatesCounts,
  getEvents,
} from "./_lib/queries"
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "./_lib/validations";

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)

  const validFilters = getValidFilters(search.filters)

  const promises = Promise.all([
    getCompetitions({
      ...search,
      filters: validFilters,
    }),
    getEvents(),
    getStatesCounts(),
  ])

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">
          Competencias oficiales de la WCA en México
        </h1>
      </div>
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
          <CompetitionsTable promises={promises} />
        </React.Suspense>
      </div>
    </main>
  );
}
