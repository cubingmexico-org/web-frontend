import * as React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SORTable } from "./_components/sor-table";
import { getSOR, getSORGenderCounts, getSORStateCounts } from "./_lib/queries";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "./_lib/validations";
import { RankTypeSelector } from "./_components/rank-type-selector";

interface PageProps {
  params: Promise<{ rankType: "single" | "average" }>;
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const rankType = (await props.params).rankType;

  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getSOR(
      {
        ...search,
        filters: validFilters,
      },
      rankType,
    ),
    getSORStateCounts(rankType),
    getSORGenderCounts(rankType),
  ]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          {search.state
            ? `Sum of Ranks de ${search.state} (${rankType === "single" ? "Single" : "Average"})`
            : `Sum of Ranks (${rankType === "single" ? "Single" : "Average"})`}
        </h1>
        <RankTypeSelector selectedRankType={rankType} />
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
          <SORTable promises={promises} rankType={rankType} />
        </React.Suspense>
      </div>
    </main>
  );
}
