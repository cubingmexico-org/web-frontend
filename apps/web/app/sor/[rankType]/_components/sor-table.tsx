"use client";

import * as React from "react";
import type { DataTableFilterField } from "@/types";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type { getSORSingles } from "../_lib/queries";
import { getColumns } from "./sor-table-columns";

interface SORSinglesTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getSORSingles>>]>;
}

export function SORSinglesTable({ promises }: SORSinglesTableProps) {
  const [{ data, pageCount }] = React.use(promises);

  const columns = React.useMemo(() => getColumns(), []);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<{
    regionRank: number | null;
    personId: string;
    name: string | null;
    overall: number | null;
    events: unknown;
    state: string | null;
    gender: string | null;
  }>[] = [
    {
      id: "name",
      label: "Nombre",
      placeholder: "Buscar por nombre...",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "regionRank", desc: false }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        gender: false,
        state: false,
      },
    },
    getRowId: (originalRow) => originalRow.personId,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
