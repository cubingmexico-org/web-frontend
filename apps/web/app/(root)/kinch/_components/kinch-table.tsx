"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getKinch,
  getKinchGenderCounts,
  getKinchStateCounts,
} from "../_lib/queries";
import { getColumns } from "./kinch-table-columns";

interface KinchTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getKinch>>,
      Awaited<ReturnType<typeof getKinchStateCounts>>,
      Awaited<ReturnType<typeof getKinchGenderCounts>>,
    ]
  >;
}

export function KinchTable({ promises }: KinchTableProps) {
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
      columnPinning: { right: ["actions"] },
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
