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
import { GenderSelector } from "./_components/gender-selector";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  const search = searchParamsCache.parse(searchParams);

  const records = await getRecords(search);
  const states = await getStates();

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          {search.state
            ? `Récords estatales de ${search.state}`
            : `Récords nacionales`}{" "}
          {search.gender
            ? `(${search.gender === "m" ? "Masculinos" : "Femeniles"})`
            : undefined}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-sm">Estado</span>
            <StateSelector states={states} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GenderSelector />
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
                    href={`/competitions/${record.single.competitionId}`}
                  >
                    {record.single.competition}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <p className="flex gap-4">
                    {record.single.solves.map((value, _, array) => {
                      const min = record.single.solves.length === 5 ? Math.min(...array.filter((n) => n !== 0)) : undefined;
                      const max =  record.single.solves.length === 5 ? Math.max(...array) : undefined;
                      const formattedValue = record.eventId === "333mbf"
                        ? formatTime333mbf(value)
                        : record.eventId === "333fm"
                          ? value === -1 ? "DNF" : value === -2 ? "DNS" : value
                          : formatTime(value);

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
                      href={`/competitions/${record.average?.competitionId}`}
                    >
                      {record.average?.competition}
                    </Link>
                  </TableCell>
                <TableCell className="whitespace-nowrap">
                  <p className="flex gap-4">
                    {record.average?.solves.map((value, _, array) => {
                      const min = record.average?.solves.length === 5 ? Math.min(...array.filter((n) => n !== 0)) : undefined;
                      const max =  record.average?.solves.length === 5 ? Math.max(...array) : undefined;
                      const formattedValue = record.eventId === "333mbf"
                        ? formatTime333mbf(value)
                        : record.eventId === "333fm"
                          ? value === -1 ? "DNF" : value === -2 ? "DNS" : value
                          : formatTime(value);

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
                </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      ))}
    </>
  );
}
