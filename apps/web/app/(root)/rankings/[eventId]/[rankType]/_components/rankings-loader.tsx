import { searchParamsCache } from "../_lib/validations";
import {
  getRankSingles,
  getRankSinglesStateCounts,
  getRankSinglesGenderCounts,
  getRankAverages,
  getRankAveragesStateCounts,
  getRankAveragesGenderCounts,
} from "../_lib/queries";
import { RankSinglesTable, RankAveragesTable } from "./rankings-table";
import { getValidFilters } from "@/lib/data-table";
import type { SearchParams } from "@/types";
import type { EventId } from "@/types/wca";

export async function RankSinglesLoader({
  searchParams,
  eventId,
}: {
  searchParams: Promise<SearchParams>;
  eventId: EventId;
}) {
  const search = searchParamsCache.parse(await searchParams);
  const validFilters = getValidFilters(search.filters);
  const promises = Promise.all([
    getRankSingles({ ...search, filters: validFilters }, eventId),
    getRankSinglesStateCounts(eventId),
    getRankSinglesGenderCounts(eventId),
  ]);
  return <RankSinglesTable promises={promises} />;
}

export async function RankAveragesLoader({
  searchParams,
  eventId,
}: {
  searchParams: Promise<SearchParams>;
  eventId: EventId;
}) {
  const search = searchParamsCache.parse(await searchParams);
  const validFilters = getValidFilters(search.filters);
  const promises = Promise.all([
    getRankAverages({ ...search, filters: validFilters }, eventId),
    getRankAveragesStateCounts(eventId),
    getRankAveragesGenderCounts(eventId),
  ]);
  return <RankAveragesTable promises={promises} />;
}
