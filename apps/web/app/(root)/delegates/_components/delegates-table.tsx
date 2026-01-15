"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getDelegateStatusCounts,
  getDelegates,
  getDelegatesGenderCounts,
  getDelegatesStateCounts,
} from "../_lib/queries";
import { getColumns } from "./delegates-table-columns";

interface DelegatesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getDelegates>>,
      Awaited<ReturnType<typeof getDelegatesStateCounts>>,
      Awaited<ReturnType<typeof getDelegatesGenderCounts>>,
      Awaited<ReturnType<typeof getDelegateStatusCounts>>,
    ]
  >;
}

export function DelegatesTable({ promises }: DelegatesTableProps) {
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
