import * as React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import {
  RankAveragesTable,
  RankSinglesTable,
} from "./_components/rankings-table";
import {
  getRankSinglesGenderCounts,
  getRankSingles,
  getRankSinglesStateCounts,
  getRankAverages,
  getRankAveragesStateCounts,
  getRankAveragesGenderCounts,
} from "./_lib/queries";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "./_lib/validations";
import { EventSelector } from "./_components/event-selector";
import { getEvents } from "@/db/queries";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ eventId: string; rankType: "single" | "average" }>;
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const eventId = (await props.params).eventId;
  const rankType = (await props.params).rankType;

  if (eventId === "333mbf" && rankType === "average") {
    redirect(`/rankings/333mbf/single`);
  }

  const search = searchParamsCache.parse(searchParams);

  console.log("search", search);

  const validFilters = getValidFilters(search.filters);

  const promises =
    rankType === "single"
      ? Promise.all([
          getRankSingles(
            {
              ...search,
              filters: validFilters,
            },
            eventId,
          ),
          getRankSinglesStateCounts(eventId),
          getRankSinglesGenderCounts(eventId),
        ])
      : Promise.all([
          getRankAverages(
            {
              ...search,
              filters: validFilters,
            },
            eventId,
          ),
          getRankAveragesStateCounts(eventId),
          getRankAveragesGenderCounts(eventId),
        ]);

  const events = await getEvents();

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <EventSelector
        className="mb-6"
        events={events}
        selectedEventId={eventId}
        selectedRankType={rankType}
      />
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
            <RankSinglesTable promises={promises} />
          ) : (
            <RankAveragesTable promises={promises} />
          )}
        </React.Suspense>
      </div>
    </main>
  );
}
