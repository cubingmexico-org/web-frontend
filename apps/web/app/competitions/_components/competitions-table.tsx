"use client";

import * as React from "react";
import type { DataTableFilterField } from "@/types";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getCompetitions,
  getStateCounts,
  getStatusCounts,
} from "../_lib/queries";
import { getColumns } from "./competitions-table-columns";
import type { Competition } from "../_types";
import { formatStatusName, getStatusIcon } from "../_lib/utils";
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
  const filterFields: DataTableFilterField<Competition>[] = [
    {
      id: "name",
      label: "Nombre",
      placeholder: "Buscar por nombre...",
    },
    {
      id: "state",
      label: "Estado",
      options: Object.keys(stateCounts).map((name) => ({
        label: name,
        value: name,
        count: stateCounts[name],
      })),
    },
    {
      id: "status",
      label: "Estatus",
      options: Object.keys(statusCounts).map((name) => {
        const statusName = name as "past" | "in_progress" | "upcoming";
        return {
          label: formatStatusName(statusName),
          value: statusName,
          icon: getStatusIcon(statusName),
          count: statusCounts[statusName],
        };
      }),
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
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
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
