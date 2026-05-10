"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getStreakRanks,
  getStreakRanksGenderCounts,
  getStreakRanksStateCounts,
} from "../_lib/queries";
import { getColumns } from "./streak-table-columns";

interface StreakTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getStreakRanks>>,
      Awaited<ReturnType<typeof getStreakRanksStateCounts>>,
      Awaited<ReturnType<typeof getStreakRanksGenderCounts>>,
    ]
  >;
}

export function StreakTable({ promises }: StreakTableProps) {
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
      sorting: [{ id: "rank", desc: false }],
      columnVisibility: {
        gender: false,
        state: false,
      },
    },
    getRowId: (originalRow) => originalRow.personId,
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
