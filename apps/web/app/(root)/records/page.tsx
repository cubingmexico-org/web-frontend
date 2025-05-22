import * as React from "react";
import { getRecords } from "./_lib/queries";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";
import { getStates } from "@/db/queries";
import { StateSelector } from "./_components/state-selector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { formatTime333mbf, formatTime } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";
import { GenderSelector } from "./_components/gender-selector";
import { MEAN_EVENTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Récords | Cubing México",
  description:
    "Encuentra los récords nacionales de speedcubing en México y descubre los mejores cuberos del país.",
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  const search = searchParamsCache.parse(searchParams);

  const records = await getRecords(search);
  const states = await getStates();

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          {search.state
            ? `Récords estatales de ${search.state}`
            : `Récords nacionales`}{" "}
          {search.gender
            ? `(${search.gender === "m" ? "Masculinos" : "Femeniles"})`
            : undefined}
        </h1>
        <div className="flex items-center justify-between">
          <GenderSelector />
          <StateSelector states={states} />
        </div>
      </div>
      {records.map((record) => (
        <div key={record.eventId} className="space-y-4 py-4">
          <div className="flex gap-2 items-center">
            <span className={`cubing-icon event-${record.eventId} text-2xl`} />
            <h1>{record.eventName}</h1>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Competencia</TableHead>
                <TableHead>Resoluciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Single</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link
                    className="hover:underline"
                    href={`/persons/${record.single.personId}`}
                  >
                    {record.single.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {record.eventId === "333mbf"
                    ? formatTime333mbf(record.single.best)
                    : record.eventId === "333fm"
                      ? record.single.best
                      : formatTime(record.single.best)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {record.single.state}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link
                    className="hover:underline"
                    href={`https://www.worldcubeassociation.org/competitions/${record.single.competitionId}`}
                  >
                    {record.single.competition}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {record.eventId === "333mbf" ? (
                    <p className="flex gap-4">
                      <span>
                        {formatTime333mbf(record.single.solves.value1)}
                      </span>
                      {record.single.solves.value2 !== 0 && (
                        <span>
                          {formatTime333mbf(record.single.solves.value2)}
                        </span>
                      )}
                      {record.single.solves.value3 !== 0 && (
                        <span>
                          {formatTime333mbf(record.single.solves.value3)}
                        </span>
                      )}
                    </p>
                  ) : MEAN_EVENTS.includes(record.eventId) ? (
                    <>
                      {record.eventId === "333fm" ? (
                        <p className="flex gap-4">
                          <span>
                            {record.single.solves.value1 === -1
                              ? "DNF"
                              : record.single.solves.value1}
                          </span>
                          <span>
                            {record.single.solves.value2 === -1
                              ? "DNF"
                              : record.single.solves.value2}
                          </span>
                          <span>
                            {record.single.solves.value3 === -1
                              ? "DNF"
                              : record.single.solves.value3}
                          </span>
                        </p>
                      ) : (
                        <p className="flex gap-4">
                          <span>{formatTime(record.single.solves.value1)}</span>
                          <span>{formatTime(record.single.solves.value2)}</span>
                          <span>{formatTime(record.single.solves.value3)}</span>
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="flex gap-4">
                      {[
                        record.single.solves.value1,
                        record.single.solves.value2,
                        record.single.solves.value3,
                        record.single.solves.value4,
                        record.single.solves.value5,
                      ].map((value, _, array) => {
                        const min = Math.min(...array.filter((n) => n !== 0));
                        const max = Math.max(...array);
                        const formattedValue = formatTime(value);

                        return (
                          <span key={value}>
                            {value === 0
                              ? null
                              : value === min || value === max
                                ? `(${formattedValue})`
                                : formattedValue}
                          </span>
                        );
                      })}
                    </p>
                  )}
                </TableCell>
              </TableRow>
              {record.eventId !== "333mbf" ? (
                <TableRow>
                  <TableCell>Average</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Link
                      className="hover:underline"
                      href={`/persons/${record.average?.personId}`}
                    >
                      {record.average?.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {record.average?.best ? (
                      formatTime(record.average.best)
                    ) : (
                      <span className="text-muted-foreground font-thin">
                        N/A
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {record.average?.state}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Link
                      className="hover:underline"
                      href={`https://www.worldcubeassociation.org/competitions/${record.average?.competitionId}`}
                    >
                      {record.average?.competition}
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {MEAN_EVENTS.includes(record.eventId) ? (
                      <>
                        {record.eventId === "333fm" ? (
                          <p className="flex gap-4">
                            <span>
                              {record.average?.solves.value1 === -1
                                ? "DNF"
                                : record.average?.solves.value1}
                            </span>
                            <span>
                              {record.average?.solves.value2 === -1
                                ? "DNF"
                                : record.average?.solves.value2}
                            </span>
                            <span>
                              {record.average?.solves.value3 === -1
                                ? "DNF"
                                : record.average?.solves.value3}
                            </span>
                          </p>
                        ) : (
                          <p className="flex gap-4">
                            <span>
                              {record.average?.solves.value1
                                ? formatTime(
                                    record.average?.solves.value1 as number,
                                  )
                                : null}
                            </span>
                            <span>
                              {record.average?.solves.value2
                                ? formatTime(
                                    record.average?.solves.value2 as number,
                                  )
                                : null}
                            </span>
                            <span>
                              {record.average?.solves.value3
                                ? formatTime(
                                    record.average?.solves.value3 as number,
                                  )
                                : null}
                            </span>
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="flex gap-4">
                        {[
                          record.average?.solves.value1,
                          record.average?.solves.value2,
                          record.average?.solves.value3,
                          record.average?.solves.value4,
                          record.average?.solves.value5,
                        ].map((value, _, array) => {
                          const min = Math.min(
                            ...(array as number[]).filter((n) => n !== 0),
                          );
                          const max = Math.max(...(array as number[]));
                          const formattedValue = formatTime(value as number);

                          console.log(value);

                          return (
                            <span key={value}>
                              {value === 0 || value === undefined
                                ? null
                                : value === min || value === max
                                  ? `(${formattedValue})`
                                  : formattedValue}
                            </span>
                          );
                        })}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      ))}
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
          <Link
            href="https://www.worldcubeassociation.org/"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            sitio web oficial de la WCA
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
