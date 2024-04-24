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
import Link from 'next/link';
import { Medal, Users, Trophy } from 'lucide-react';
import { fetchCompetitions, fetchTableData } from '@/app/lib/data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
export default async function Page() {
  const competitions = await fetchCompetitions();
  const tableData = await fetchTableData();

  return (
    <Table>
      <TableCaption>Resultados obtenidos del <Link className="hover:underline italic" href="https://github.com/thewca/wcif/blob/master/specification.md">WCA Competition Interchange Format</Link></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center text-lg font-bold" colSpan={competitions.length + 3}>Marcador</TableHead>
        </TableRow>
        <TableRow>
          <TableHead className="text-center font-bold" colSpan={2} rowSpan={2}>
            <div className="flex items-center justify-center">
              Equipos
              <Users className="w-4 h-4 ml-1" />
            </div>
          </TableHead>
          <TableHead className="text-center font-bold hidden sm:table-cell" colSpan={competitions.length}>
            <div className="flex items-center justify-center">
              Competencias
              <Trophy className="w-4 h-4 ml-1" />
            </div>
          </TableHead>
          <TableHead className="text-center font-bold max-w-[100px]" rowSpan={2}>Puntos totales</TableHead>
        </TableRow>
        <TableRow>
          {competitions.map((competition, index) => (
            <TableHead className="text-center hidden sm:table-cell max-w-[100px]" key={index}>
              <Link className="hover:underline" href={`https://live.worldcubeassociation.org/link/competitions/${competition.id}`}>
                {competition.name}
              </Link>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((team, teamIndex) => (
          team.members.map((member, memberIndex) => (
            <TableRow key={memberIndex}>
              {memberIndex === 0 && (
                <>
                  <TableCell className="font-semibold max-w-[100px] text-center" rowSpan={team.members.length}>
                    <div className="flex flex-col items-center">
                      {teamIndex === 0 && <Medal className="w-6 h-6 mb-1 text-yellow-500" />}
                      {teamIndex === 1 && <Medal className="w-6 h-6 mb-1 text-gray-400" />}
                      {teamIndex === 2 && <Medal className="w-6 h-6 mb-1 text-yellow-600" />}
                      {team.teamName}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[100px] sm:max-w-none">
                    <Link className="text-green-800 hover:underline" href={`/${member.id}`}>
                      {member.name}
                    </Link>
                  </TableCell>
                  {competitions.map((competition) => (
                    <TableCell className="text-center hidden sm:table-cell" key={competition.id}>{member.scores[competition.id]}</TableCell>
                  ))}
                  <TableCell className="text-center" rowSpan={team.members.length}>{team.totalPoints}</TableCell>
                </>
              )}
              {memberIndex !== 0 && (
                <>
                  <TableCell className="max-w-[100px] sm:max-w-none">
                    <Link className="text-green-800 hover:underline" href={`/${member.id}`}>
                      {member.name}
                    </Link>
                  </TableCell>
                  {competitions.map((competition) => (
                    <TableCell className="text-center hidden sm:table-cell" key={competition.id}>{member.scores[competition.id]}</TableCell>
                  ))}
                </>
              )}
            </TableRow>
          ))
        ))}
      </TableBody>
    </Table>
  );
}