import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import type { SumOfRanks } from "../_types";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<SumOfRanks>().withDefault([
    { id: "rank", desc: false },
  ]),
  name: parseAsString.withDefault(""),
  state: parseAsArrayOf(parseAsString).withDefault([]),
  gender: parseAsArrayOf(parseAsString).withDefault([]),
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
