import { Skeleton } from "@workspace/ui/components/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function Loading() {
  return (
    <>
      <div className="grid gap-6">
        <div className="flex justify-end">
          <Skeleton className="h-9 w-56" />
        </div>

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

      <div className="bg-white-700 mx-auto my-5 w-[98%]">
        <div className="flex gap-2 items-center justify-start mb-2">
          <Skeleton className="h-9 w-45" />
        </div>
        <div className="h-[480px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
