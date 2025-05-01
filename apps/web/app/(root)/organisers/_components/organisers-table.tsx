"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getOrganiserStatusCounts,
  getPersons,
  getPersonsGenderCounts,
  getPersonsStateCounts,
} from "../_lib/queries";
import { getColumns } from "./organisers-table-columns";

interface PersonsTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getPersons>>,
      Awaited<ReturnType<typeof getPersonsStateCounts>>,
      Awaited<ReturnType<typeof getPersonsGenderCounts>>,
      Awaited<ReturnType<typeof getOrganiserStatusCounts>>,
    ]
  >;
}

export function PersonsTable({ promises }: PersonsTableProps) {
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
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        gender: false,
        status: false,
      },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
