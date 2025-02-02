"use client";

import * as React from "react";
import type { DataTableFilterField } from "@/types";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type { getKinch } from "../_lib/queries";
import { getColumns } from "./kinch-table-columns";
import type { KinchRanks } from "../_types";

interface KinchTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getKinch>>]>;
}

export function KinchTable({ promises }: KinchTableProps) {
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
  const filterFields: DataTableFilterField<KinchRanks>[] = [
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
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
