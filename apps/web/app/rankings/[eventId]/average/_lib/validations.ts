import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { type RankAverage } from "@/db/schema";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<RankAverage>().withDefault([
    { id: "countryRank", desc: false },
  ]),
  name: parseAsString.withDefault(""),
  state: parseAsArrayOf(parseAsString).withDefault([]),
  gender: parseAsArrayOf(parseAsString).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetRankAveragesSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
