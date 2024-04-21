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
import Image from 'next/image';
import Link from 'next/link';
import { fetchCompetitions, fetchTableData } from '@/app/lib/data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
export default async function Page() {
  const competitions = await fetchCompetitions();
  const tableData = await fetchTableData();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex">
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden 2xl:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden xl:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden lg:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden md:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          height={300}
          src="/border.svg"
          width={300}
        />
      </div>
      <div className="text-center">
        <div className="mx-auto inline-block">
          <Image
            alt="Logo de la Copa Inter-Patrocinadores"
            className="mx-auto"
            height={300}
            src="/logo.svg"
            width={300}
          />
        </div>
        <h1 className="text-2xl font-semibold">Copa Inter-Patrocinadores</h1>
        <h2 className="text-lg">Primera temporada (Abril - Julio)</h2>
        <p className="p-4">Competencia dirigida a la comunidad nacional, con el propósito de dar mayor protagonismo a los speedcubers y a las tiendas que los apoyan, motivarlos a seguir compitiendo y mejorando sus tiempos, y hacer crecer el speedcubing en todo el país.</p>
      </div>
      <div className="p-4">
        <Table>
          <TableCaption>Resultados obtenidos del <Link className="hover:underline" href="https://github.com/thewca/wcif/blob/master/specification.md">WCA Competition Interchange Format</Link></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center text-lg font-semibold" colSpan={competitions.length + 3}>Marcador</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-[100px] text-center font-semibold" colSpan={2} rowSpan={2}>Equipos</TableHead>
              {/* <TableHead className="text-center hidden lg:table-cell" colSpan={competitions.length}>Competencias</TableHead> */}
              <TableHead className="text-center font-semibold" colSpan={competitions.length}>Competencias</TableHead>
              <TableHead className="text-center font-semibold" rowSpan={2}>Puntos totales</TableHead>
            </TableRow>
            <TableRow>
              {competitions.map((competition, index) => (
                // <TableHead className="text-center hidden lg:table-cell" key={index}>{competition.name}</TableHead>
                <TableHead className="text-center" key={index}><Link href={`https://live.worldcubeassociation.org/link/competitions/${competition.id}`}>{competition.name}</Link></TableHead>
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
                      <TableCell><Link href={`https://www.worldcubeassociation.org/persons/${member.id}`}>{member.name}</Link></TableCell>
                      {competitions.map((competition) => (
                        // <TableCell className="text-center hidden lg:table-cell">{member.scores[competition.id]}</TableCell>
                        <TableCell className="text-center">{member.scores[competition.id]}</TableCell>
                      ))}
                      <TableCell className="text-center" rowSpan={team.members.length}>{team.totalPoints}</TableCell>
                    </>
                  )}
                  {memberIndex !== 0 && (
                    <>
                      <TableCell><Link href={`https://www.worldcubeassociation.org/persons/${member.id}`}>{member.name}</Link></TableCell>
                      {competitions.map((competition) => (
                        // <TableCell className="text-center hidden lg:table-cell">{member.scores[competition.id]}</TableCell>
                        <TableCell className="text-center">{member.scores[competition.id]}</TableCell>
                      ))}
                    </>
                  )}
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-center p-4">
        <p className="font-bold text-lg">Aviso</p>
        <p>
          El contador aún se encuentra en fase de pruebas, por lo que podría haber ocasiones en las que los PRs no se contabilicen correctamente. Si observas alguna inconsistencia, te agradeceríamos que la reportaras. Agradecemos tu comprensión y colaboración en este asunto.
        </p>
        <p className="mt-2">Esta página se actualiza sábados y domingos a las 21:00 UTC-6 (9 PM hora de la Ciudad de México).</p>
        <p className="mt-2">
          Puedes contactarnos a través de:
          <ul className="list-disc list-inside mt-2">
            <li><Link className="text-blue-500 hover:underline" href="https://www.facebook.com/cubingmexico">Cubing México</Link></li>
            {/* eslint-disable-next-line react/no-unescaped-entities -- . */}
            <li className="mt-2"><Link className="text-blue-500 hover:underline" href="https://www.facebook.com/profile.php?id=100063651453072">SanLuis Rubik's Team</Link></li>
          </ul>
        </p>
        <div className="flex justify-center items-center pt-4">
          <Image
            alt="Logo de Cubing México"
            height={100}
            src="/cubingmexico_logo.svg"
            width={100}
          />
          <Image
            alt="Logo de SanLuis Rubik's Team"
            height={100}
            src="/slp_logo.svg"
            width={100}
          />
        </div>
      </div>
      <div className="flex">
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden 2xl:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden xl:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden lg:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden md:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          height={300}
          src="/border.svg"
          width={300}
        />
      </div>
    </main>
  );
}