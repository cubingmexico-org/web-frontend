import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Skeleton className="h-10 w-full md:w-[300px]" />
        <Skeleton className="h-10 w-full md:w-auto md:min-w-60" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card overflow-hidden">
            <Skeleton className="h-32 rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
