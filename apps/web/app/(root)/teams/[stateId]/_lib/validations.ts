import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import type { Member } from "../_types";
import * as z from "zod";
import { person } from "@/db/schema";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Member>().withDefault([
    { id: "name", desc: false },
  ]),
  name: parseAsString.withDefault(""),
  gender: parseAsArrayOf(z.enum(person.gender.enumValues)).withDefault([]),
  specialties: parseAsArrayOf(z.string()).withDefault([]),
  achievements: parseAsArrayOf(z.string()).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetMembersSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
