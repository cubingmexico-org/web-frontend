import React from "react";
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table"
import { ArrowLeft } from 'lucide-react';
import { fetchIndividualData } from '@/app/lib/data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
export default async function Page({ params }: { params: { id: string } }) {
  const data = await fetchIndividualData(params.id);

  return (
    <>
      <Link className="flex items-center justify-center mb-2 hover:underline text-sm" href="/"><ArrowLeft className="h-4 w-4 mr-1" /> Regresar</Link>
      <Table>
        <TableCaption>Resultados obtenidos del <Link className="hover:underline italic" href="https://github.com/thewca/wcif/blob/master/specification.md">WCA Competition Interchange Format</Link></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center text-lg font-bold" colSpan={2}>Puntos de <Link className="hover:underline" href={`https://www.worldcubeassociation.org/persons/${data[0].member_id}`}>{data[0].member_name}</Link></TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="font-bold">Competencia</TableHead>
            <TableHead className="font-bold text-center">Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key=''>
              <TableCell>
                <Link className="text-green-800 hover:underline" href={`https://live.worldcubeassociation.org/link/competitions/${item.competition_id}`}>{item.competition_name}</Link>
              </TableCell>
              <TableCell className="text-center">
                {item.score}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}