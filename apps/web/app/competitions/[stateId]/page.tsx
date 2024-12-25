/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable @typescript-eslint/await-thenable -- . */

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@repo/ui/table";
import { sql } from "drizzle-orm";
import { Badge } from "@repo/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/tabs";
import { competition, state, event } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { formatCompetitionDateSpanish } from "@/lib/utils";
import { StateSelect } from "../_components/state-select";

interface PageProps {
  params: {
    stateId: string;
  };
}

export default async function Page({
  params,
}: PageProps): Promise<JSX.Element> {
  const { stateId } = await params;

  const competitions = await db
    .select()
    .from(competition)
    .where(sql`${competition.stateId} = ${stateId}`)
    .orderBy(
      sql`${competition.year} DESC`,
      sql`${competition.month} DESC`,
      sql`${competition.day} DESC`
    );

  const states = await db
    .select()
    .from(state);

  const events = await db
    .select()
    .from(event)
    .where(sql`${event.rank} < 200`)
    .orderBy(event.rank);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Competencias oficiales en México</h1>
        <Badge className="!h-fit">{competitions.length}</Badge>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <p className="text-lg mb-4 sm:mb-0">
          Ver a los mejores speedcubers de cada estado mexicano en varios eventos de la WCA.
        </p>
        <div className="w-full sm:w-auto">
          <StateSelect initialSelectedStateId={stateId} states={states} />
        </div>
      </div>

      <Tabs className="w-full" defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="!w-12">#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categorías</TableHead>
                <TableHead>Fechas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.map((comp, index) => {
                const competitionEvents = comp.eventSpecs?.split(" ");
                const orderedCompetitionEvents = competitionEvents?.map(eventId => events.find(event => event.id === eventId))
                  .filter(event => event !== undefined)
                  .sort((a, b) => a.rank - b.rank)
                  .map(event => event.id);

                return (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{comp.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {orderedCompetitionEvents?.map((event) => (
                          <span className={`cubing-icon event-${event}`} key={event} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatCompetitionDateSpanish(comp)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="past">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="!w-12">#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categorías</TableHead>
                <TableHead>Fechas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.map((comp, index) => {
                const competitionEvents = comp.eventSpecs?.split(" ");
                const orderedCompetitionEvents = competitionEvents?.map(eventId => events.find(event => event.id === eventId))
                  .filter(event => event !== undefined)
                  .sort((a, b) => a.rank - b.rank)
                  .map(event => event.id);

                return (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{comp.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {orderedCompetitionEvents?.map((event) => (
                          <span className={`cubing-icon event-${event}`} key={event} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatCompetitionDateSpanish(comp)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

    </main>
  );
}