import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { ChevronDown } from "lucide-react";
import { sql } from "drizzle-orm";
import { result } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { formatTime } from "@/lib/utils";

type Params = Promise<{ eventId: string; type: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { eventId } = await params;

  const rankings = await db
    .selectDistinctOn([result.personId])
    .from(result)
    .where(sql`${result.eventId} = ${eventId}`)
    .orderBy(
      sql`${result.personId}`,
      // sql`${result.best} DESC`
    );

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Clasificaciones Estatales Mexicanas
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <p className="text-lg mb-4 sm:mb-0">
          Ver a los mejores speedcubers de cada estado mexicano en varios
          eventos de la WCA.
        </p>
        <div className="w-full sm:w-auto">
          {/* <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event} value={event}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ranking</TableHead>
            <TableHead>Nombre</TableHead>
            {/* <TableHead>Estado</TableHead> */}
            <TableHead className="text-right">Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings.map((ranking, index) => (
            <TableRow key={ranking.personId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{ranking.personName}</TableCell>
              {/* <TableCell>{ranking.state}</TableCell> */}
              <TableCell className="text-right">
                {formatTime(ranking.best)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-center">
        <Button>
          Cargar más
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </main>
  );
}
