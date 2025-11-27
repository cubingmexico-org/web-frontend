"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getOrganiserStatusCounts,
  getOrganisers,
  getOrganisersGenderCounts,
  getOrganisersStateCounts,
} from "../_lib/queries";
import { getColumns } from "./organisers-table-columns";

interface OrganisersTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getOrganisers>>,
      Awaited<ReturnType<typeof getOrganisersStateCounts>>,
      Awaited<ReturnType<typeof getOrganisersGenderCounts>>,
      Awaited<ReturnType<typeof getOrganiserStatusCounts>>,
    ]
  >;
}

export function OrganisersTable({ promises }: OrganisersTableProps) {
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
    getRowId: (originalRow) => originalRow.id,
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
