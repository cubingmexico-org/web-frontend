/* eslint-disable react/jsx-key -- . */
/* eslint-disable react/no-array-index-key -- . */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table"
import React from "react";
import { fetchCompetitions, fetchTableData } from '@/app/lib/data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
export default async function Page() {
  const competitions = await fetchCompetitions();
  const tableData = await fetchTableData();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">COPA INTER-PATROCINADORES</h1>
      <h2 className='mb-4'>TRÍO LEGENDARIO</h2>
      <div className="p-4">
        <Table>
          <TableCaption>Resultados obtenidos de la World Cube Association</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center" colSpan={2} rowSpan={2}>Equipos</TableHead>
              <TableHead className="text-center hidden lg:table-cell" colSpan={competitions.length}>Competencias</TableHead>
              <TableHead className="text-right" rowSpan={2}>Puntos totales</TableHead>
            </TableRow>
            <TableRow>
              {competitions.map((competition, index) => (
                <TableHead className="text-center hidden lg:table-cell" key={index}>{competition.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((team) => (
              team.members.map((member, memberIndex) => (
                <TableRow key={memberIndex}>
                  {memberIndex === 0 && (
                    <>
                      <TableCell className="font-medium" rowSpan={team.members.length}>
                        {team.teamName}
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                      {competitions.map((competition) => (
                        <TableCell className="text-center hidden lg:table-cell">{member.scores[competition.id]}</TableCell>
                      ))}
                      <TableCell className="text-center" rowSpan={team.members.length}>{team.totalPoints}</TableCell>
                    </>
                  )}
                  {memberIndex !== 0 && (
                    <>
                      <TableCell>{member.name}</TableCell>
                      {competitions.map((competition) => (
                        <TableCell className="text-center hidden lg:table-cell">{member.scores[competition.id]}</TableCell>
                      ))}
                    </>
                  )}
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}