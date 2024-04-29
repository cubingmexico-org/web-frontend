import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { Button } from "@repo/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
}: DataTablePaginationProps<TData>): JSX.Element {
  return (
    <div className="ui-flex ui-w-full ui-flex-col-reverse ui-items-center ui-justify-between ui-gap-4 ui-overflow-auto ui-p-1 sm:ui-flex-row sm:ui-gap-8">
      <div className="ui-flex-1 ui-whitespace-nowrap ui-text-sm ui-text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} filas(s) seleccionadas.
      </div>
      <div className="!ui-flex !ui-flex-col-reverse !ui-items-center !ui-gap-4 sm:!ui-flex-row sm:!ui-gap-6 lg:!ui-gap-8">
        <div className="ui-flex ui-items-center ui-space-x-2">
          <p className="ui-whitespace-nowrap ui-text-sm ui-font-medium">Filas por página</p>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
            value={`${table.getState().pagination.pageSize}`}
          >
            <SelectTrigger className="ui-h-8 !ui-w-[4.5rem]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="ui-flex ui-items-center ui-justify-center ui-text-sm ui-font-medium">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="ui-flex ui-items-center ui-space-x-2">
          <Button
            aria-label="Go to first page"
            className="ui-hidden !ui-size-8 !ui-p-0 lg:ui-flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => { table.setPageIndex(0); }}
            variant="outline"
          >
            <DoubleArrowLeftIcon aria-hidden="true" className="ui-size-4" />
          </Button>
          <Button
            aria-label="Go to previous page"
            className="!ui-size-8"
            disabled={!table.getCanPreviousPage()}
            onClick={() => { table.previousPage(); }}
            size="icon"
            variant="outline"
          >
            <ChevronLeftIcon aria-hidden="true" className="ui-size-4" />
          </Button>
          <Button
            aria-label="Go to next page"
            className="!ui-size-8"
            disabled={!table.getCanNextPage()}
            onClick={() => { table.nextPage(); }}
            size="icon"
            variant="outline"
          >
            <ChevronRightIcon aria-hidden="true" className="ui-size-4" />
          </Button>
          <Button
            aria-label="Go to last page"
            className="ui-hidden !ui-size-8 lg:ui-flex"
            disabled={!table.getCanNextPage()}
            onClick={() => { table.setPageIndex(table.getPageCount() - 1); }}
            size="icon"
            variant="outline"
          >
            <DoubleArrowRightIcon aria-hidden="true" className="ui-size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}