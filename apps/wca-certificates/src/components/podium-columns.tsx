"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  CheckCircle,
  AlertCircle,
  // MoreHorizontal
} from 'lucide-react'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// import { Button } from "@repo/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@repo/ui/dropdown-menu"
import { Checkbox } from "@repo/ui/checkbox"
// import { DataTableColumnHeader } from "@repo/ui/data-table-column-header"
import type { Event } from '@/types/types';

export const columns: ColumnDef<Event>[] = [
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
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Evento" />
  //   ),
  //   cell: ({ row }) => {
  //     return <span className={`cubing-icon event-${row.original.id} text-2xl`} />
  //   },
  // },
  {
    accessorKey: "id",
    header: "Evento",
    cell: ({ row }) => {
      return <span className={`cubing-icon event-${row.original.id} text-2xl`} />
    },
  },
  {
    accessorKey: "rounds",
    header: "Resultados",
    cell: ({ row }) => {
      const rounds = row.original.rounds
      // console.log(row.original.id)
      // console.log(rounds[rounds.length - 1].results.length > 0 && rounds[rounds.length - 1].results.every(result => result.ranking !== null))
      return <p className="flex items-center">
        {
          rounds.length > 0 &&
          <>
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- . */}
            {rounds[rounds.length - 1].results.length > 0 && rounds[rounds.length - 1].results.every(result => result.ranking !== null)
              ? <>Disponibles<CheckCircle className="ml-2" color="green" /></>
              : <>No disponibles todavía<AlertCircle className="ml-2" color="red" /></>}
          </>
        }
      </p>
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const payment = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button className="h-8 w-8 p-0" variant="ghost">
  //             <span className="sr-only">Abrir menú</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Acciones</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             // eslint-disable-next-line @typescript-eslint/no-misused-promises -- This is a client-side only app
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // }
]
