/* eslint-disable @typescript-eslint/no-unnecessary-condition -- . */
"use client"

import * as React from "react"
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { DataTablePagination } from "@repo/ui/data-table-pagination"
import { Input } from "@repo/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table"
import type { ParticipantData } from '@/types/wca-live';
import { getDictionary } from "@/get-dictionary";

interface DataTableProps<TData, TValue> {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["certificates"]["participation"]["document_settings"]["data_table"]
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowSelection: Record<string, boolean>;
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function DataTable<TData extends ParticipantData, TValue>({
  dictionary,
  columns,
  data,
  rowSelection,
  setRowSelection,
}: DataTableProps<TData, TValue>): JSX.Element {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getRowId: row => row.wcaId,
    enableRowSelection: row => row.original.results.every((result: {
      event: string;
      average: number;
      ranking: number | null;
    }) => result.ranking !== null),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div>
      <div className="mb-2">
        <Input
          className="max-w-sm"
          onChange={(event) => 
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          placeholder={dictionary.filterByName}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  {dictionary.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5 mt-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
