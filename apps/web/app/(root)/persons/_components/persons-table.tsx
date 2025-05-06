"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getPersons,
  getPersonsGenderCounts,
  getPersonsStateCounts,
} from "../_lib/queries";
import { getColumns } from "./persons-table-columns";

interface PersonsTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getPersons>>,
      Awaited<ReturnType<typeof getPersonsStateCounts>>,
      Awaited<ReturnType<typeof getPersonsGenderCounts>>,
    ]
  >;
}

export function PersonsTable({ promises }: PersonsTableProps) {
  const [{ data, pageCount }, stateCounts, genderCounts] = React.use(promises);

  const columns = React.useMemo(
    () =>
      getColumns({
        stateCounts,
        genderCounts,
      }),
    [stateCounts, genderCounts],
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
