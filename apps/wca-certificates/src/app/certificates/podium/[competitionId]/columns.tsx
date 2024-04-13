"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@repo/ui/button'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Download } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Result = {
  personId: number
  ranking: number
  attempts: any[]
  best: number
  average: number
}

type Round = {
  id: string
  format: string
  timeLimit: any
  cutoff: string | null
  advancementCondition: any
  scrambleSetCount: number
  results: Result[]
  extensions: any[]
}

export type Event = {
  id: string
  rounds: Round[]
  extensions: any
  qualification: null | string
}

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "id",
    header: "Evento",
    cell: ({ row }) => {
      return <span className={`cubing-icon event-${row.original.id} text-2xl`}></span>
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
              ? <>Disponibles<CheckCircle color="green" className="ml-2" /></>
              : <>No disponibles todavía<AlertCircle color="red" className="ml-2" /></>}
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
