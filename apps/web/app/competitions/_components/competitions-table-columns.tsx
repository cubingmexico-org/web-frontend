"use client";

import * as React from "react";
import type { Event } from "@/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { Competition } from "../_types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface GetColumnsProps {
  events: Event[];
}

export function getColumns({
  events,
}: GetColumnsProps): ColumnDef<Competition>[] {
  return [
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha" className="ml-2" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 ml-2">
            <span>
              {formatDate(row.getValue("startDate"), row.original.endDate)}
            </span>
          </div>
        );
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
          <div className="flex space-x-2">
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
      enableHiding: false,
    },
    {
      accessorKey: "eventSpecs",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Eventos" />
      ),
      cell: ({ row }) => {
        const competitionEvents = (row.getValue("eventSpecs") as string).split(
          " ",
        );
        const orderedCompetitionEvents = competitionEvents
          ?.map((eventId) => events.find((event) => event.id === eventId))
          .filter((event) => event !== undefined)
          .sort((a, b) => a.rank - b.rank)
          .map((event) => event.id);
        return (
          <div className="flex space-x-2">
            {orderedCompetitionEvents?.map((event) => (
              <span className={`cubing-icon event-${event}`} key={event} />
            ))}
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
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("state")}
            </span>
          </div>
        );
      },
      enableHiding: false,
    },
  ];
}
