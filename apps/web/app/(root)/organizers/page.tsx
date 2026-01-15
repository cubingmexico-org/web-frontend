import * as React from "react";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { OrganizersTable } from "./_components/organizers-table";
import {
  getOrganizerStatusCounts,
  getOrganizers,
  getOrganizersGenderCounts,
  getOrganizersStateCounts,
} from "./_lib/queries";
import { getValidFilters } from "@/lib/data-table";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getOrganizers({
      ...search,
      filters: validFilters,
    }),
    getOrganizersStateCounts(),
    getOrganizersGenderCounts(),
    getOrganizerStatusCounts(),
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
      <OrganizersTable promises={promises} />
    </React.Suspense>
  );
}
