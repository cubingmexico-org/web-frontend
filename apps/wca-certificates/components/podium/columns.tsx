"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import type { Event } from "@/types/wcif";

export const columns: ColumnDef<Event>[] = [
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
    accessorKey: "id",
    header: "Evento",
    cell: ({ row }) => {
      return (
        <span className={`cubing-icon event-${row.original.id} text-2xl`} />
      );
    },
  },
  {
    accessorKey: "rounds",
    header: "Resultados",
    cell: ({ row }) => {
      const rounds = row.original.rounds;
      return (
        <p className="flex items-center">
          {rounds.length > 0 && (
            <>
              {rounds[rounds.length - 1]!.results.length > 0 &&
              rounds[rounds.length - 1]?.results.every(
                (result) => result.ranking !== null,
              ) ? (
                <>
                  Disponibles
                  <CheckCircle className="ml-2" color="green" />
                </>
              ) : (
                <>
                  No disponibles todavía
                  <AlertCircle className="ml-2" color="red" />
                </>
              )}
            </>
          )}
        </p>
      );
    },
  },
];
