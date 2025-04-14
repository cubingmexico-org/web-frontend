"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import type { ParticipantData } from "@/types/wcif";

export const columns: ColumnDef<ParticipantData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Seleccionar todo"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(Boolean(value));
        }}
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          aria-label="Seleccionar fila"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(Boolean(value));
          }}
        />
      );
    },
  },
  {
    accessorKey: "wcaId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} lang="es" title="WCA ID" />
    ),
    cell: ({ row }) => {
      return <p className="font-semibold">{row.original.wcaId}</p>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} lang="es" title="Nombre" />
    ),
    cell: ({ row }) => {
      return <p>{row.original.name}</p>;
    },
  },
  {
    accessorKey: "results",
    header: "Resultados",
    cell: ({ row }) => {
      if (row.original.results.every((result) => result.ranking !== null)) {
        return (
          <p className="flex items-center justify-center md:justify-start">
            <span className="hidden md:inline">Disponibles</span>
            <CheckCircle className="ml-2" color="green" />
          </p>
        );
      }

      return (
        <p className="flex items-center justify-center md:justify-start">
          <span className="hidden md:inline">No disponibles todavía</span>
          <AlertCircle className="ml-2" color="red" />
        </p>
      );
    },
  },
];
