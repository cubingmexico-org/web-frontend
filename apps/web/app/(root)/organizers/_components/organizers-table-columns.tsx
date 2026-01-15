"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Person } from "../_types";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { Check, X } from "lucide-react";

interface GetColumnsProps {
  stateCounts: Record<string, number>;
  genderCounts: Record<string, number>;
  statusCounts: Record<string, number>;
}

export function getColumns({
  stateCounts,
  genderCounts,
  statusCounts,
}: GetColumnsProps): ColumnDef<Person>[] {
  return [
    {
      accessorKey: "wcaId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="WCA ID" />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("wcaId")}</div>;
      },
      enableHiding: false,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div className="flex space-x-2 whitespace-nowrap">
            <Badge variant={status === "active" ? "default" : "outline"}>
              {status === "active" ? "Activo" : "Inactivo"}
            </Badge>
            <Link
              className="hover:underline text-accent-foreground"
              href={`/persons/${row.original.wcaId}`}
            >
              {row.getValue("name")}
            </Link>
          </div>
        );
      },
      meta: {
        label: "Nombre",
        variant: "text",
        placeholder: "Buscar por nombre...",
      },
      enableHiding: false,
      enableColumnFilter: true,
    },
    {
      id: "state",
      accessorKey: "state",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2 whitespace-nowrap">
          {row.getValue("state") ?? (
            <span className="text-muted-foreground font-light">N/A</span>
          )}
        </div>
      ),
      meta: {
        label: "Estado",
        variant: "multiSelect",
        options: Object.keys(stateCounts).map((name) => ({
          label: name,
          value: name,
          count: stateCounts[name],
        })),
      },
      enableColumnFilter: true,
      enableHiding: false,
    },
    {
      id: "gender",
      accessorKey: "gender",
      meta: {
        label: "Género",
        variant: "multiSelect",
        options: Object.keys(genderCounts).map((name) => ({
          label:
            name === "m" ? "Masculino" : name === "f" ? "Femenino" : "Otro",
          value: name,
          count: genderCounts[name],
        })),
      },
      enableColumnFilter: true,
    },
    {
      id: "status",
      accessorKey: "status",
      meta: {
        label: "Estatus",
        variant: "multiSelect",
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
      enableColumnFilter: true,
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
