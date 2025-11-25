import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-8 w-64 mx-auto mb-4" />

      <div className="w-full flex justify-center gap-2 mb-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="w-full flex justify-center mb-6">
        <Skeleton className="w-[300px] h-[300px] rounded" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">WCA ID</TableHead>
            <TableHead className="text-center">Sexo</TableHead>
            <TableHead className="text-center">Competencias</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              <Skeleton className="h-5 w-20 mx-auto" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-5 w-24 mx-auto" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-5 w-20 mx-auto" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-5 w-12 mx-auto" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Skeleton className="h-7 w-64 mx-auto my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead className="text-center">SR</TableHead>
            <TableHead className="text-center">NR</TableHead>
            <TableHead className="text-center">CR</TableHead>
            <TableHead className="text-center">WR</TableHead>
            <TableHead className="text-center">Single</TableHead>
            <TableHead className="text-center">Average</TableHead>
            <TableHead className="text-center">WR</TableHead>
            <TableHead className="text-center">CR</TableHead>
            <TableHead className="text-center">NR</TableHead>
            <TableHead className="text-center">SR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 18 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-6 w-6" />
              </TableCell>
              {Array.from({ length: 10 }).map((_, j) => (
                <TableCell key={j} className="text-center">
                  <Skeleton className="h-5 w-12 mx-auto" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-6">
        <div>
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Oro</TableHead>
                <TableHead className="text-center">Plata</TableHead>
                <TableHead className="text-center">Bronce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">WR</TableHead>
                <TableHead className="text-center">CR</TableHead>
                <TableHead className="text-center">NR</TableHead>
                <TableHead className="text-center">SR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-8 mx-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 my-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-6 w-8" />
      </div>
      <Skeleton className="w-full h-96 rounded-lg" />
    </>
  );
}
