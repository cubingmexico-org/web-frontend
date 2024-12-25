import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Loading(): JSX.Element {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="h-9 w-1/3 rounded-xl mb-4" />
      <Table>
        <TableHeader>
          <TableRow className="h-12">
            <TableHead>
              <Skeleton className="h-5 w-5 rounded-tl-xl" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-32 rounded-tl-xl" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-48 rounded-tl-xl" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-48 rounded-tl-xl" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
          <TableRow className="h-[57px]">
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-48" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}