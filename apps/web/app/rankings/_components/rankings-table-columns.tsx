"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatTime } from "@/lib/utils";
import { RankSingle } from "../_types";

export function getColumns(): ColumnDef<RankSingle>[] {
  return [
    {
      accessorKey: "countryRank",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="NR" className="ml-2" />
      ),
      cell: ({ row }) => {
        return (
          <div className="ml-2 w-2 ">
            {row.getValue("countryRank")}
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
            {row.getValue("name")}
          </div>
        );
      },
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
            {formatTime(row.getValue("best"))}
          </div>
        );
      },
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
    //         <span className="max-w-[31.25rem] truncate font-medium">
    //           {row.getValue("state")}
    //         </span>
    //       </div>
    //     );
    //   },
    //   enableHiding: false,
    // },
  ];
}
