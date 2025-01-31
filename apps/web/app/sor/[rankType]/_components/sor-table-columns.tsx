"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { cn } from "@workspace/ui/lib/utils";
import { SumOfRanks } from "../_types";

interface Event {
  eventId: string;
  countryRank: number;
  completed: boolean;
}

export function getColumns(): ColumnDef<SumOfRanks>[] {
  return [
    {
      accessorKey: "regionRank",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" className="ml-2" />
      ),
      cell: ({ row }) => {
        return <div className="ml-2 w-2">{row.getValue("regionRank")}</div>;
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
          <div className="flex space-x-2 w-72">{row.getValue("name")}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "overall",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2 justify-center font-semibold">
          {row.getValue("overall")}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_333",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "333");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_222",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-222" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "222");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_444",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-444" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "444");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_555",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-555" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "555");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_666",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-666" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "666");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_777",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-777" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "777");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_333bf",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333bf" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "333bf");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_333fm",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333fm" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "333fm");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_333oh",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333oh" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "333oh");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_clock",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-clock" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "clock");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_minx",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-minx" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "minx");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_pyram",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-pyram" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "pyram");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_skewb",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-skewb" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "skewb");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_sq1",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-sq1" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "sq1");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_444bf",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-444bf" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "444bf");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_555bf",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-555bf" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "555bf");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events_333mbf",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333mbf" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.original.events as Event[];
        const event = events.find((event) => event.eventId === "333mbf");
        return (
          <div
            className={cn(
              "flex space-x-2 justify-center",
              event?.countryRank !== undefined &&
                event.countryRank <= 10 &&
                "text-green-500 font-semibold",
              !event?.completed && "text-red-500 font-semibold",
            )}
          >
            {event?.countryRank ?? "N/A"}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "state",
    },
    {
      accessorKey: "gender",
    },
  ];
}
