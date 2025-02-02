import * as React from "react";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";
import { getStates } from "@/db/queries";
import { StateSelector } from "./_components/state-selector";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { KinchTable } from "./_components/kinch-table";
import { getKinch } from "./_lib/queries";
import { getValidFilters } from "@/lib/data-table";
// import { GenderSelector } from "./_components/gender-selector";

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
  ]);

  const states = await getStates();

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Kinch Ranks</h1>
        <StateSelector states={states} />
        {/* <GenderSelector /> */}
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
          <KinchTable promises={promises} />
        </React.Suspense>
      </div>
    </main>
  );
}
