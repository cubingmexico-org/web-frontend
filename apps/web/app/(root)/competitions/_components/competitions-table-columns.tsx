"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { Competition } from "../_types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { formatStatusName, getStatusIcon } from "../_lib/utils";

interface GetColumnsProps {
  stateCounts: Record<string, number>;
  statusCounts: Record<"past" | "in_progress" | "upcoming", number>;
}

export function getColumns({
  stateCounts,
  statusCounts,
}: GetColumnsProps): ColumnDef<Competition>[] {
  return [
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha" className="ml-2" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 ml-2 whitespace-nowrap">
            <span>
              {formatDate(row.getValue("startDate"), row.original.endDate)}
            </span>
          </div>
        );
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
        const enumValues = {
          past: "Pasada",
          in_progress: "En progreso",
          upcoming: "Próxima",
        };
        const label =
          enumValues[row.original.status as keyof typeof enumValues];

        return (
          <div className="flex space-x-2">
            {(row.original.isChampionship as boolean) && (
              <Badge>Campeonato</Badge>
            )}
            <Badge
              variant={
                row.original.status === "upcoming"
                  ? "default"
                  : row.original.status === "in_progress"
                    ? "outline"
                    : "secondary"
              }
            >
              {label}
            </Badge>
            <Link
              className="max-w-[31.25rem] truncate font-medium hover:underline"
              href={`https://www.worldcubeassociation.org/competitions/${row.original.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.getValue("name")}
            </Link>
          </div>
        );
      },
      meta: {
        label: "Nombre",
        placeholder: "Buscar por nombre...",
        variant: "text",
      },
      enableColumnFilter: true,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Eventos" />
      ),
      cell: ({ row }) => {
        const eventIds = row.getValue("events") as string[];
        return (
          <div className="flex space-x-2">
            {eventIds.map((eventId) => (
              <span key={eventId} className={`cubing-icon event-${eventId}`} />
            ))}
          </div>
        );
      },
      enableHiding: false,
    },
    {
      id: "state",
      accessorKey: "state",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("state")}
            </span>
          </div>
        );
      },
      meta: {
        label: "Estado",
        placeholder: "Buscar por estado...",
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
      id: "status",
      accessorKey: "status",
      meta: {
        label: "Estatus",
        variant: "multiSelect",
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
      enableColumnFilter: true,
      enableHiding: false,
    },
  ];
}
