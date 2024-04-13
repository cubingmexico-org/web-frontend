"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle, AlertCircle } from 'lucide-react'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import type { Event } from '@/types/types';

export const columns: ColumnDef<Event>[] = [
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
      return <p className="flex items-center">
        {
          rounds.length > 0 && 
          <>
            {rounds[rounds.length - 1].results.length > 0 
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
  //     const rounds = row.original.rounds
 
  //     return (
  //       <Button onClick={() => console.log(row.original.id)} variant="ghost" className="h-8 w-8 p-0" disabled={rounds[rounds.length - 1].results.length <= 0}>
  //         <Download className="h-4 w-4" />
  //       </Button>
  //     )
  //   },
  // },
]
