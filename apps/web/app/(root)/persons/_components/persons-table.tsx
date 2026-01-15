"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getCompetitors,
  getCompetitorsGenderCounts,
  getCompetitorsStateCounts,
} from "../_lib/queries";
import { getColumns } from "./persons-table-columns";

interface CompetitorsTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getCompetitors>>,
      Awaited<ReturnType<typeof getCompetitorsStateCounts>>,
      Awaited<ReturnType<typeof getCompetitorsGenderCounts>>,
    ]
  >;
}

export function CompetitorsTable({ promises }: CompetitorsTableProps) {
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
      columnVisibility: {
        gender: false,
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
