"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getCompetitions,
  getStateCounts,
  getStatusCounts,
} from "../_lib/queries";
import { getColumns } from "./competitions-table-columns";
// import { getEventsIcon } from "../_lib/utils";

interface CompetitionsTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getCompetitions>>,
      Awaited<ReturnType<typeof getStateCounts>>,
      Awaited<ReturnType<typeof getStatusCounts>>,
    ]
  >;
}

export function CompetitionsTable({ promises }: CompetitionsTableProps) {
  const [{ data, pageCount }, stateCounts, statusCounts] = React.use(promises);

  const columns = React.useMemo(
    () =>
      getColumns({
        stateCounts,
        statusCounts,
      }),
    [stateCounts, statusCounts],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "startDate", desc: true }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
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
