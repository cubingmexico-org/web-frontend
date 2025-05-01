import * as React from "react";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { KinchTable } from "./_components/kinch-table";
import {
  getKinch,
  getKinchGenderCounts,
  getKinchStateCounts,
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
    getKinch({
      ...search,
      filters: validFilters,
    }),
    getKinchStateCounts(),
    getKinchGenderCounts(),
  ]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Kinch Ranks nacionales</h1>
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
          <KinchTable promises={promises} />
        </React.Suspense>
      </div>
    </main>
  );
}
