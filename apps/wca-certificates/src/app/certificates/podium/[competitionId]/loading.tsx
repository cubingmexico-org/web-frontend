import { Skeleton } from "@repo/ui/skeleton"

export default function Loading(): JSX.Element {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="h-9 w-1/3 rounded-xl mb-4" />
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4"><Skeleton className="h-6 w-[75px]" /></th>
              <th className="p-4"><Skeleton className="h-6 w-[100px]" /></th>
            </tr>
          </thead>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- . */}
          {[...Array(8)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key -- No unique id needed
            <tr key={i}>
              <td className="p-4"><Skeleton className="h-8 w-8" /></td>
              <td className="p-4"><Skeleton className="h-6 w-[100px]" /></td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  )
}