"use client";

import * as React from "react";
import type { DataTableFilterField } from "@/types";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type {
  getOrganiserStatusCounts,
  getPersons,
  getPersonsGenderCounts,
  getPersonsStateCounts,
} from "../_lib/queries";
import { getColumns } from "./organisers-table-columns";
import type { Person } from "../_types";
import { Check, X } from "lucide-react";

interface PersonsTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getPersons>>,
      Awaited<ReturnType<typeof getPersonsStateCounts>>,
      Awaited<ReturnType<typeof getPersonsGenderCounts>>,
      Awaited<ReturnType<typeof getOrganiserStatusCounts>>,
    ]
  >;
}

export function PersonsTable({ promises }: PersonsTableProps) {
  const [{ data, pageCount }, stateCounts, genderCounts, statusCounts] =
    React.use(promises);

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
  const filterFields: DataTableFilterField<Person>[] = [
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
    {
      id: "status",
      label: "Estatus",
      options: Object.keys(statusCounts).map((name) => {
        const statusName = name as "inactive" | "active";
        return {
          label: statusName === "active" ? "Activo" : "Inactivo",
          value: statusName,
          icon: statusName === "active" ? Check : X,
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
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        gender: false,
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
