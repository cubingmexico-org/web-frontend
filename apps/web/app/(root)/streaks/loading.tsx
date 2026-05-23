import { Skeleton } from "@workspace/ui/components/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="grid gap-6">
        <DataTableSkeleton
          columnCount={7}
          filterCount={2}
          cellWidths={[
            "10rem",
            "30rem",
            "10rem",
            "10rem",
            "6rem",
            "6rem",
            "6rem",
          ]}
          shrinkZero
        />
      </div>
    </>
  );
}
