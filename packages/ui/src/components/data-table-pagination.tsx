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
  lang: 'es' | 'en'
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  lang = 'es',
  table,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
}: DataTablePaginationProps<TData>): JSX.Element {

  const dictionary = {
    es: {
      rowsSelected: "{0} de {1} fila(s) seleccionadas.",
      rowsPerPage: "Filas por página",
      pageOf: "Página {0} de {1}",
      goToFirstPage: "Ir a la primera página",
      goToPreviousPage: "Ir a la página anterior",
      goToNextPage: "Ir a la siguiente página",
      goToLastPage: "Ir a la última página",
    },
    en: {
      rowsSelected: "{0} of {1} row(s) selected.",
      rowsPerPage: "Rows per page",
      pageOf: "Page {0} of {1}",
      goToFirstPage: "Go to first page",
      goToPreviousPage: "Go to previous page",
      goToNextPage: "Go to next page",
      goToLastPage: "Go to last page",
    },
  }[lang];

  return (
    <div className="ui-flex ui-w-full ui-flex-col-reverse ui-items-center ui-justify-between ui-gap-4 ui-overflow-auto ui-p-1 sm:ui-flex-row sm:ui-gap-8">
      <div className="ui-flex-1 ui-whitespace-nowrap ui-text-sm ui-text-muted-foreground">
        {`${table.getFilteredSelectedRowModel().rows.length} ${dictionary.rowsSelected.split("{0}")[1].split("{1}")[0]} ${table.getFilteredRowModel().rows.length} ${dictionary.rowsSelected.split("{1}")[1]}`}
      </div>
      <div className="!ui-flex !ui-flex-col-reverse !ui-items-center !ui-gap-4 sm:!ui-flex-row sm:!ui-gap-6 lg:!ui-gap-8">
        <div className="ui-flex ui-items-center ui-space-x-2">
          <p className="ui-whitespace-nowrap ui-text-sm ui-font-medium">{dictionary.rowsPerPage}</p>
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
          {dictionary.pageOf.replace("{0}", (table.getState().pagination.pageIndex + 1).toString()).replace("{1}", (table.getPageCount()).toString())}
        </div>
        <div className="ui-flex ui-items-center ui-space-x-2">
          <Button
            aria-label={dictionary.goToFirstPage}
            className="ui-hidden !ui-size-8 !ui-p-0 lg:ui-flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => { table.setPageIndex(0); }}
            variant="outline"
          >
            <DoubleArrowLeftIcon aria-hidden="true" className="ui-size-4" />
          </Button>
          <Button
            aria-label={dictionary.goToPreviousPage}
            className="!ui-size-8"
            disabled={!table.getCanPreviousPage()}
            onClick={() => { table.previousPage(); }}
            size="icon"
            variant="outline"
          >
            <ChevronLeftIcon aria-hidden="true" className="ui-size-4" />
          </Button>
          <Button
            aria-label={dictionary.goToNextPage}
            className="!ui-size-8"
            disabled={!table.getCanNextPage()}
            onClick={() => { table.nextPage(); }}
            size="icon"
            variant="outline"
          >
            <ChevronRightIcon aria-hidden="true" className="ui-size-4" />
          </Button>
          <Button
            aria-label={dictionary.goToLastPage}
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