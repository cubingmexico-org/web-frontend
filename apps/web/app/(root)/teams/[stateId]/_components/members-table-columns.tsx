"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Member } from "../_types";
import Link from "next/link";
import { TeamMember } from "@/db/schema";

export function getColumns(): ColumnDef<Member>[] {
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
        return (
          <div className="ml-2 w-2">
            <Link
              className="hover:underline text-accent-foreground"
              href={`https://www.worldcubeassociation.org/persons/${row.getValue("id")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.getValue("id")}
            </Link>
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
      accessorKey: "gender",
    },
    {
      accessorKey: "podiums",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Podios" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="text-accent-foreground">
              {row.getValue("podiums")}
            </span>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "stateRecords",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="text-xs"
          column={column}
          title="Récords Estatales"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="text-accent-foreground">
              {row.getValue("stateRecords")}
            </span>
          </div>
        );
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: "specialties",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="text-xs"
          column={column}
          title="Especialidades"
        />
      ),
      cell: ({ row }) => {
        const specialties = row.getValue(
          "specialties",
        ) as TeamMember["specialties"];

        return (
          <div className="flex space-x-2 w-72">
            {specialties ? (
              <>
                {specialties.map((specialty) => (
                  <span
                    className={`cubing-icon event-${specialty}`}
                    key={specialty}
                  />
                ))}
              </>
            ) : (
              <span className="text-muted-foreground">Sin especilidades</span>
            )}
          </div>
        );
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: "achievements",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="text-xs"
          column={column}
          title="Logros"
        />
      ),
      cell: ({ row }) => {
        const achievements = row.getValue(
          "achievements",
        ) as TeamMember["achievements"];

        return (
          <div className="flex space-x-2 w-72">
            {achievements ? (
              <>
                {achievements.map((achievement) => (
                  <span className="text-accent-foreground" key={achievement}>
                    {achievement}
                  </span>
                ))}
              </>
            ) : (
              <span className="text-muted-foreground">Sin logros</span>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
