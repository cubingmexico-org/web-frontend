import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { type SumOfRanks } from "@/db/schema";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<SumOfRanks>().withDefault([
    { id: "regionRank", desc: false },
  ]),
  name: parseAsString.withDefault(""),
  state: parseAsString.withDefault(""),
  gender: parseAsString.withDefault(""),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetSORSinglesSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;

export type GetSORAveragesSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
