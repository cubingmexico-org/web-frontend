"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { RankSingle } from "../_types";

export function getColumns(): ColumnDef<RankSingle>[] {
  return [
    {
      accessorKey: "index",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" className="ml-2" />
      ),
      cell: ({ row }) => {
        return <div className="ml-2 w-2">{row.index + 1}</div>;
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
      accessorKey: "sumOfRanks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">{row.getValue("sumOfRanks")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "333");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-222" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "222");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-444" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "444");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-555" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "555");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-666" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "666");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-777" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "777");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333bf" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "333bf");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333fm" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "333fm");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333oh" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "333oh");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-clock" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "clock");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-minx" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "minx");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-pyram" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "pyram");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-skewb" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "skewb");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-sq1" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "sq1");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-444bf" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "444bf");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-555bf" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "555bf");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "events",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="cubing-icon event-333mbf" />
        </div>
      ),
      cell: ({ row }) => {
        const events = row.getValue("events") as {
          eventId: string;
          countryRank: number;
        }[];
        const event = events.find((event) => event.eventId === "333mbf");
        return (
          <div className="flex space-x-2">{event?.countryRank ?? "N/A"}</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "state",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Estado" />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex space-x-2">
    //         <span
    //           className={cn(
    //             row.getValue("state") === null
    //               ? "text-muted-foreground"
    //               : "font-medium",
    //           )}
    //         >
    //           {row.getValue("state") ?? "N/A"}
    //         </span>
    //       </div>
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "gender",
    },
  ];
}
