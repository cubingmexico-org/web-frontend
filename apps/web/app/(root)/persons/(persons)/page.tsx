import * as React from "react";
import { SearchParams } from "@/types";
import { searchParamsCache } from "../_lib/validations";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PersonsTable } from "../_components/persons-table";
import {
  getPersons,
  getPersonsGenderCounts,
  getPersonsStateCounts,
} from "../_lib/queries";
import { getValidFilters } from "@/lib/data-table";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getPersons({
      ...search,
      filters: validFilters,
    }),
    getPersonsStateCounts(),
    getPersonsGenderCounts(),
  ]);

  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton
          columnCount={7}
          filterCount={2}
          cellWidths={[
            "10rem",
            "30rem",
            "10rem",
            "10rem",
            "6rem",
            "6rem",
            "6rem",
          ]}
          shrinkZero
        />
      }
    >
      <PersonsTable promises={promises} />
    </React.Suspense>
  );
}
