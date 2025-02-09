"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Person } from "../_types";
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
        return (
          <div className="flex space-x-2 w-72">
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
      accessorKey: "competitions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Competencias" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">{row.getValue("competitions")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "states",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estados visitados" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">{row.getValue("states")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "podiums",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Podios" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">{row.getValue("podiums")}</div>
      ),
      enableHiding: false,
    },
  ];
}
