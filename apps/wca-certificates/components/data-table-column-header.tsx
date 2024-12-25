import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import type { Column } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  lang: "es" | "en";
  column: Column<TData, TValue>;
  title: string;
  showHide?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  lang = "es",
  column,
  title,
  className,
  showHide = false,
}: DataTableColumnHeaderProps<TData, TValue>): JSX.Element {
  const dictionary = {
    es: {
      asc: "Ascendente",
      desc: "Descendente",
      hide: "Esconder",
    },
    en: {
      asc: "Ascending",
      desc: "Descending",
      hide: "Hide",
    },
  }[lang];

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            size="sm"
            variant="ghost"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              column.toggleSorting(false);
            }}
          >
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {dictionary.asc}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              column.toggleSorting(true);
            }}
          >
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {dictionary.desc}
          </DropdownMenuItem>
          {showHide ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  column.toggleVisibility(false);
                }}
              >
                <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {dictionary.hide}
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
