import * as React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SORSinglesTable } from "./_components/sor-table";
import { getSORSingles } from "./_lib/queries";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "./_lib/validations";
import { StateSelector } from "./_components/state-selector";
import { GenderSelector } from "./_components/gender-selector";
import { getStates } from "@/db/queries";

interface PageProps {
  params: Promise<{ rankType: "single" | "average" }>;
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const rankType = (await props.params).rankType;

  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises =
    rankType === "single"
      ? Promise.all([
          getSORSingles({
            ...search,
            filters: validFilters,
          }),
        ])
      : Promise.all([
          getSORSingles({
            ...search,
            filters: validFilters,
          }),
        ]);

  const states = await getStates();

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          {search.state ? `Sum of Ranks de ${search.state} ` : `Sum of Ranks`}{" "}
          {search.gender
            ? `(${search.gender === "m" ? "Masculinos" : "Femeniles"})`
            : undefined}
        </h1>
        <StateSelector states={states} />
        <GenderSelector />
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
          {rankType === "single" ? (
            <SORSinglesTable promises={promises} />
          ) : (
            <SORSinglesTable promises={promises} />
          )}
        </React.Suspense>
      </div>
    </main>
  );
}
