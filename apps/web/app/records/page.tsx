import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { getRecords } from "./_lib/queries";
import { SearchParams } from "@/types";
import { formatTime, formatTime333mbf } from "@/lib/utils";
import { searchParamsCache } from "./_lib/validations";
import { GenderSelector } from "./_components/gender-selector";
import { StateSelector } from "./_components/state-selector";
import { getStates } from "@/db/queries";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  const search = searchParamsCache.parse(searchParams);

  console.log("search:", search);

  const records = await getRecords();

  const states = await getStates();

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Récords nacionales</h1>
        <StateSelector states={states} />
        <GenderSelector />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Single</TableHead>
            <TableHead className="text-center">Evento</TableHead>
            <TableHead>Average</TableHead>
            <TableHead className="text-right">Nombre</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, index) => (
            <TableRow key={index}>
              <TableCell className="min-w-40">{record.single.name}</TableCell>
              <TableCell className="text-right">
                {record.eventId === "333mbf"
                  ? formatTime333mbf(record.single.best)
                  : record.eventId === "333fm"
                    ? record.single.best
                    : formatTime(record.single.best)}
              </TableCell>
              <TableCell className="min-w-60 font-medium flex justify-center gap-2">
                <span className={`cubing-icon event-${record.eventId}`} />
                {record.eventName}
              </TableCell>
              <TableCell>
                {record.eventId !== "333mbf" ? (
                  record.average?.best ? (
                    formatTime(record.average.best)
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )
                ) : null}
              </TableCell>
              <TableCell className="min-w-40 text-right">
                {record.average?.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">
          Acerca de los Récords de la WCA
        </h2>
        <p className="mb-4">
          Los récords de la World Cube Association (WCA) son los tiempos más
          rápidos logrados para resolver varios rompecabezas en competencias
          oficiales de la WCA. Los récords se reconocen tanto para resoluciones
          individuales como para promedios en cada evento.
        </p>
        <p className="mb-4">
          Los récords mostrados en esta página representan los récords
          nacionales actuales de México. Estos tiempos muestran las increíbles
          habilidades de los speedcubers mexicanos en diferentes eventos de la
          WCA.
        </p>
        <p>
          Para obtener más información sobre las regulaciones y récords de la
          WCA, por favor visite el{" "}
          <a
            href="https://www.worldcubeassociation.org/"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            sitio web oficial de la WCA
          </a>
          .
        </p>
      </div>
    </main>
  );
}