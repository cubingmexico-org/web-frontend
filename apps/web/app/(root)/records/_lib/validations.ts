import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  state: parseAsString.withDefault(""),
  gender: parseAsString.withDefault(""),
});

export type GetRecordsSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
