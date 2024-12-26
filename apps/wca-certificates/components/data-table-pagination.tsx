import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { type Table } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface DataTablePaginationProps<TData> {
  lang: "es" | "en";
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  lang = "es",
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
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        {`${table.getFilteredSelectedRowModel().rows.length} ${dictionary.rowsSelected.split("{0}")[1]?.split("{1}")[0]} ${table.getFilteredRowModel().rows.length} ${dictionary.rowsSelected.split("{1}")[1]}`}
      </div>
      <div className="!flex !flex-col-reverse !items-center !gap-4 sm:!flex-row sm:!gap-6 lg:!gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">
            {dictionary.rowsPerPage}
          </p>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            value={`${table.getState().pagination.pageSize}`}
          >
            <SelectTrigger className="h-8 !w-[4.5rem]">
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
        <div className="flex items-center justify-center text-sm font-medium">
          {dictionary.pageOf
            .replace(
              "{0}",
              (table.getState().pagination.pageIndex + 1).toString(),
            )
            .replace("{1}", table.getPageCount().toString())}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label={dictionary.goToFirstPage}
            className="hidden !size-8 !p-0 lg:flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.setPageIndex(0);
            }}
            variant="outline"
          >
            <ChevronsLeft aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label={dictionary.goToPreviousPage}
            className="!size-8"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.previousPage();
            }}
            size="icon"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label={dictionary.goToNextPage}
            className="!size-8"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.nextPage();
            }}
            size="icon"
            variant="outline"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label={dictionary.goToLastPage}
            className="hidden !size-8 lg:flex"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
            }}
            size="icon"
            variant="outline"
          >
            <ChevronsRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
