"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatTime, formatTime333mbf } from "@/lib/utils";
import { RankSingle } from "../_types";
import type { Event } from "@/db/schema";
import { cn } from "@workspace/ui/lib/utils";

export function getColumns(eventId: Event["id"]): ColumnDef<RankSingle>[] {
  return [
    {
      accessorKey: "countryRank",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="NR" className="ml-2" />
      ),
      cell: ({ row }) => {
        return <div className="ml-2 w-2">{row.getValue("countryRank")}</div>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => {
        return <div className="flex space-x-2">{row.getValue("name")}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "best",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Resultado" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {eventId === "333mbf" ? formatTime333mbf(row.getValue("best")) : formatTime(row.getValue("best"))}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "state",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span
              className={cn(
                row.getValue("state") === null
                  ? "text-muted-foreground"
                  : "font-medium",
              )}
            >
              {row.getValue("state") ?? "N/A"}
            </span>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "gender",
    },
  ];
}
