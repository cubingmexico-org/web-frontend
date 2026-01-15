"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getOrganizerStatusCounts,
  getOrganizers,
  getOrganizersGenderCounts,
  getOrganizersStateCounts,
} from "../_lib/queries";
import { getColumns } from "./organizers-table-columns";

interface OrganizersTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getOrganizers>>,
      Awaited<ReturnType<typeof getOrganizersStateCounts>>,
      Awaited<ReturnType<typeof getOrganizersGenderCounts>>,
      Awaited<ReturnType<typeof getOrganizerStatusCounts>>,
    ]
  >;
}

export function OrganizersTable({ promises }: OrganizersTableProps) {
  const [{ data, pageCount }, stateCounts, genderCounts, statusCounts] =
    React.use(promises);

  const columns = React.useMemo(
    () =>
      getColumns({
        stateCounts,
        genderCounts,
        statusCounts,
      }),
    [stateCounts, genderCounts, statusCounts],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnVisibility: {
        gender: false,
        status: false,
      },
    },
    getRowId: (originalRow) => originalRow.wcaId,
    shallow: false,
    clearOnDefault: true,
    enableRowSelection: false,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
