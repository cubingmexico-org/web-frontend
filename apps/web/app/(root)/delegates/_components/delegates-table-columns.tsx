"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Person } from "../_types";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";

export function getColumns(): ColumnDef<Person>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="WCA ID"
          className="ml-2"
        />
      ),
      cell: ({ row }) => {
        return <div className="ml-2 w-2">{row.getValue("id")}</div>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div className="flex space-x-2 w-80">
            <Badge variant={status === "active" ? "default" : "outline"}>
              {status === "active" ? "Activo" : "Inactivo"}
            </Badge>
            <Link
              className="hover:underline text-accent-foreground"
              href={`/persons/${row.original.id}`}
            >
              {row.getValue("name")}
            </Link>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "state",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.getValue("state") ?? (
            <span className="text-muted-foreground font-light">N/A</span>
          )}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "gender",
    },
    {
      accessorKey: "status",
    },
    {
      accessorKey: "competitions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Competencias" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">{row.getValue("competitions")}</div>
      ),
      enableHiding: false,
    },
  ];
}
