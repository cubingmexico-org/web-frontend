import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Skeleton className="h-10 w-full md:w-80" />
        <Skeleton className="h-10 w-full md:w-72" />
      </div>

      <div className="relative h-152 overflow-hidden rounded-2xl border bg-card">
        <Skeleton className="h-full w-full rounded-none" />

        <div className="absolute inset-0 p-6">
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-52" />
              </div>
              <div className="hidden gap-2 md:flex">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-4 opacity-80 md:grid-cols-3 lg:grid-cols-4">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="hidden h-28 rounded-2xl lg:block" />
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="hidden h-32 rounded-2xl lg:block" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-36 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
