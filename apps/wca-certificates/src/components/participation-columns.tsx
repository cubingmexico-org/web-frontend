"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { Checkbox } from "@repo/ui/checkbox"
import { DataTableColumnHeader } from "@repo/ui/data-table-column-header"
import type { ParticipantData } from '@/types/types';

export const columns: ColumnDef<ParticipantData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => { table.toggleAllPageRowsSelected(Boolean(value)); }}
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => { row.toggleSelected(Boolean(value)); }}
        />
      )
    },
  },
  {
    accessorKey: "wcaId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="WCA ID" />
    ),
    cell: ({ row }) => {
      return <p className="font-semibold">{row.original.wcaId}</p>
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return <p>{row.original.name}</p>
    },
  },
  {
    accessorKey: "results",
    header: "Resultados",
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- .
      if (row.original.results.every(result => result.ranking !== null)) {
        return (
          <p className="flex items-center justify-center md:justify-start">
            <span className="hidden md:inline">Disponibles</span>
            <CheckCircle className="ml-2" color="green" />
          </p>
        )
      }

      return (
        <p className="flex items-center justify-center md:justify-start">
          <span className="hidden md:inline">No disponibles todavía</span>
          <AlertCircle className="ml-2" color="red" />
        </p>
      )
    },
  },
  // {
  //   accessorKey: "rounds",
  //   header: "Resultados",
  //   cell: ({ row }) => {
  //     const rounds = row.original.rounds
  //     return <p className="flex items-center">
  //       {
  //         rounds.length > 0 && 
  //         <>
  //           {rounds[rounds.length - 1].results.length > 0 
  //             ? <>Disponibles<CheckCircle className="ml-2" color="green" /></>
  //             : <>No disponibles todavía<AlertCircle className="ml-2" color="red" /></>}
  //         </>
  //       }
  //     </p>
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const rounds = row.original.rounds

  //     return (
  //       <Button onClick={() => console.log(row.original.id)} variant="ghost" className="h-8 w-8 p-0" disabled={rounds[rounds.length - 1].results.length <= 0}>
  //         <Download className="h-4 w-4" />
  //       </Button>
  //     )
  //   },
  // },
]
