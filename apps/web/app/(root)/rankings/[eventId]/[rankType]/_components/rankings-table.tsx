"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getRankSinglesGenderCounts,
  getRankSingles,
  getRankSinglesStateCounts,
  getRankAverages,
  getRankAveragesStateCounts,
  getRankAveragesGenderCounts,
} from "../_lib/queries";
import { getColumns } from "./rankings-table-columns";

interface RankSinglesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getRankSingles>>,
      Awaited<ReturnType<typeof getRankSinglesStateCounts>>,
      Awaited<ReturnType<typeof getRankSinglesGenderCounts>>,
    ]
  >;
}

export function RankSinglesTable({ promises }: RankSinglesTableProps) {
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
      sorting: [{ id: "countryRank", desc: false }],
      columnVisibility: {
        gender: false,
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

interface RankAveragesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getRankAverages>>,
      Awaited<ReturnType<typeof getRankAveragesStateCounts>>,
      Awaited<ReturnType<typeof getRankAveragesGenderCounts>>,
    ]
  >;
}

export function RankAveragesTable({ promises }: RankAveragesTableProps) {
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
      sorting: [{ id: "countryRank", desc: false }],
      columnVisibility: {
        gender: false,
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
