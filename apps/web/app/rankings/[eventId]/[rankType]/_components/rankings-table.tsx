"use client";

import * as React from "react";
import type { DataTableFilterField } from "@/types";
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
import { RankAverage, RankSingle } from "../_types";
import type { Event } from "@/db/schema";

interface RankSinglesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getRankSingles>>,
      Awaited<ReturnType<typeof getRankSinglesStateCounts>>,
      Awaited<ReturnType<typeof getRankSinglesGenderCounts>>,
    ]
  >;
  eventId: Event["id"];
}

export function RankSinglesTable({ promises, eventId }: RankSinglesTableProps) {
  const [{ data, pageCount }, stateCounts, genderCounts] = React.use(promises);

  const columns = React.useMemo(() => getColumns(eventId), [eventId]);

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
  const filterFields: DataTableFilterField<RankSingle>[] = [
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
      id: "gender",
      label: "Género",
      options: Object.keys(genderCounts).map((name) => ({
        label: name === "m" ? "Masculino" : name === "f" ? "Femenino" : "Otro",
        value: name,
        count: genderCounts[name],
      })),
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "countryRank", desc: false }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        gender: false,
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

interface RankAveragesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getRankAverages>>,
      Awaited<ReturnType<typeof getRankAveragesStateCounts>>,
      Awaited<ReturnType<typeof getRankAveragesGenderCounts>>,
    ]
  >;
  eventId: Event["id"];
}

export function RankAveragesTable({ promises, eventId }: RankAveragesTableProps) {
  const [{ data, pageCount }, stateCounts, genderCounts] = React.use(promises);

  const columns = React.useMemo(() => getColumns(eventId), [eventId]);

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
  const filterFields: DataTableFilterField<RankAverage>[] = [
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
      id: "gender",
      label: "Género",
      options: Object.keys(genderCounts).map((name) => ({
        label: name === "m" ? "Masculino" : name === "f" ? "Femenino" : "Otro",
        value: name,
        count: genderCounts[name],
      })),
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "countryRank", desc: false }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        gender: false,
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
