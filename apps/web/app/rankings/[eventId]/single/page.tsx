import * as React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { RankSinglesTable } from "./_components/rankings-table";
import {
  getGenderCounts,
  getRankSingles,
  getStateCounts,
} from "./_lib/queries";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "./_lib/validations";
import { EventSelector } from "./_components/event-selector";
import { getEvents } from "@/db/queries";
import { RankTypeSelector } from "./_components/rank-type-selector";

interface PageProps {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const eventId = (await props.params).eventId;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getRankSingles(
      {
        ...search,
        filters: validFilters,
      },
      eventId,
    ),
    getStateCounts(eventId),
    getGenderCounts(eventId),
  ]);

  const events = await getEvents();

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <EventSelector events={events} selectedEventId={eventId} />
      <RankTypeSelector selectedEventId={eventId} />
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
          <RankSinglesTable promises={promises} />
        </React.Suspense>
      </div>
    </main>
  );
}
