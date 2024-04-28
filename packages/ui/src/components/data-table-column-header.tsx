import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons"
import type { Column } from "@tanstack/react-table"
import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { cn } from "../lib/utils"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  showHide?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  showHide = false,
}: DataTableColumnHeaderProps<TData, TValue>): JSX.Element {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("ui-flex ui-items-center ui-space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="-ui-ml-3 ui-h-8 data-[state=open]:ui-bg-accent"
            size="sm"
            variant="ghost"
          >
            <span>{title}</span>
            {/* eslint-disable-next-line no-nested-ternary -- . */}
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ui-ml-2 ui-h-4 ui-w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ui-ml-2 ui-h-4 ui-w-4" />
            ) : (
              <CaretSortIcon className="ui-ml-2 ui-h-4 ui-w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => { column.toggleSorting(false); }}>
            <ArrowUpIcon className="ui-mr-2 ui-h-3.5 ui-w-3.5 ui-text-muted-foreground/70" />
            Ascendente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { column.toggleSorting(true); }}>
            <ArrowDownIcon className="ui-mr-2 ui-h-3.5 ui-w-3.5 ui-text-muted-foreground/70" />
            Descendente
          </DropdownMenuItem>
          {showHide ? <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { column.toggleVisibility(false); }}>
                <EyeNoneIcon className="ui-mr-2 ui-h-3.5 ui-w-3.5 ui-text-muted-foreground/70" />
                Esconder
              </DropdownMenuItem>
            </> : null
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
