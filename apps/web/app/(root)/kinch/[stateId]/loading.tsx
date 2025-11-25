import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full max-w-xs" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Total</TableHead>
            {Array.from({ length: 17 }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-6 w-6" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              {Array.from({ length: 17 }).map((_, eventIndex) => (
                <TableCell key={eventIndex}>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
