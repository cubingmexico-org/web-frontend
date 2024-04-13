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

const COMPETITIONS = ["Return Open", "Puerta La Victoria", "Mexicali Rose", "Vasconcubos"];

const TABLE_DATA = [
  {
    teamName: "Cubos Dany",
    members: [
      { 
        name: "Alexis Cazu", 
        scores: {
          "Return Open": 3,
          "Puerta La Victoria": 2,
          "Mexicali Rose": 4,
          "Vasconcubos": 1
        }
      },
      { 
        name: "Sail Ramírez", 
        scores: {
          "Return Open": 2,
          "Puerta La Victoria": 0,
          "Mexicali Rose": 3,
          "Vasconcubos": 0
        }
      },
      { 
        name: "Alex Salceda", 
        scores: {
          "Return Open": 0,
          "Puerta La Victoria": 2,
          "Mexicali Rose": 3,
          "Vasconcubos": 1
        }
      },
    ],
    totalPoints: 21,
  },
  {
    teamName: "Fleit's Cubes",
    members: [
      { 
        name: "Isaac Vergara", 
        scores: {
          "Return Open": 3,
          "Puerta La Victoria": 2,
          "Mexicali Rose": 4,
          "Vasconcubos": 1
        }
      },
      { 
        name: "Eduardo Mendiola", 
        scores: {
          "Return Open": 2,
          "Puerta La Victoria": 0,
          "Mexicali Rose": 3,
          "Vasconcubos": 0
        }
      },
      { 
        name: "Arturo Palacios", 
        scores: {
          "Return Open": 0,
          "Puerta La Victoria": 2,
          "Mexicali Rose": 3,
          "Vasconcubos": 1
        }
      },
    ],
    totalPoints: 21,
  }
]

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">COPA INTER-PATROCINADORES</h1>
      <h2 className='mb-4'>TRÍO LEGENDARIO</h2>
      <div>
        <Table>
          <TableCaption>Resultados obtenidos del WCIF</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center" colSpan={2} rowSpan={2}>Equipos</TableHead>
              <TableHead className="text-center" colSpan={COMPETITIONS.length}>Competencias</TableHead>
              <TableHead className="text-right" rowSpan={2}>Puntos totales</TableHead>
            </TableRow>
            <TableRow>
              {COMPETITIONS.map((competition, index) => (
                <TableHead key={index}>{competition}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {TABLE_DATA.map((team, index) => (
              <React.Fragment key={index}>
                {team.members.map((member, memberIndex) => (
                  <TableRow key={memberIndex}>
                    {memberIndex === 0 && (
                      <>
                        <TableCell className="font-medium" rowSpan={team.members.length}>
                          {team.teamName}
                        </TableCell>
                        <TableCell>{member.name}</TableCell>
                        {COMPETITIONS.map((competition) => (
                          <TableCell className="text-center">{member.scores[competition as keyof typeof member.scores]}</TableCell>
                        ))}
                        <TableCell className="text-center" rowSpan={team.members.length}>{team.totalPoints}</TableCell>
                      </>
                    )}
                    {memberIndex !== 0 && (
                      <>
                        <TableCell>{member.name}</TableCell>
                        {COMPETITIONS.map((competition) => (
                          <TableCell className="text-center">{member.scores[competition as keyof typeof member.scores]}</TableCell>
                        ))}
                      </>
                    )}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}