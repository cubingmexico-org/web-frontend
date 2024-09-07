/* eslint-disable @typescript-eslint/no-unnecessary-condition -- . */
/* eslint-disable camelcase -- . */
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@repo/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/tabs";
import { Medal, Trophy, User, Users } from "lucide-react";
import Link from "next/link";
import {
  fetchCompetitions,
  fetchIndividualTable,
  fetchTeamsTable,
} from "../actions";
import type { GroupedData } from "../types";

export default async function Page(): Promise<JSX.Element> {
  const competitions = await fetchCompetitions();
  const teamsData = await fetchTeamsTable(competitions);
  const individualData = await fetchIndividualTable(competitions);

  const groupedTeamsData: GroupedData = teamsData.reduce<GroupedData>(
    (acc, item) => {
      const { team_name, total_score, ...rest } = item;
      if (!acc[team_name]) {
        acc[team_name] = {
          members: [],
          total_score: 0,
        };
      }
      acc[team_name].members.push(rest);
      acc[team_name].total_score += parseInt(total_score, 10);
      return acc;
    },
    {},
  );

  return (
    <Tabs defaultValue="teams">
      <div className="flex justify-center w-full">
        <TabsList>
          <TabsTrigger value="teams">Marcador por equipos</TabsTrigger>
          <TabsTrigger value="individual">Marcador individual</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="teams">
        <Table>
          <TableCaption>
            Resultados obtenidos del{" "}
            <Link
              className="hover:underline italic"
              href="https://github.com/thewca/wcif/blob/master/specification.md"
            >
              WCA Competition Interchange Format
            </Link>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                className="text-center text-lg font-bold"
                colSpan={competitions.length + 3}
              >
                Marcador por equipos
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead
                className="text-center font-bold"
                colSpan={2}
                rowSpan={2}
              >
                <div className="flex items-center justify-center">
                  Equipos
                  <Users className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead
                className="text-center font-bold hidden sm:table-cell"
                colSpan={competitions.length}
              >
                <div className="flex items-center justify-center">
                  Competencias
                  <Trophy className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead
                className="text-center font-bold max-w-[100px]"
                rowSpan={2}
              >
                Puntos totales
              </TableHead>
            </TableRow>
            <TableRow>
              {competitions.map((competition) => (
                <TableHead
                  className="text-center hidden sm:table-cell max-w-[100px]"
                  key={competition.id}
                >
                  <Link
                    className="hover:underline"
                    href={`https://live.worldcubeassociation.org/link/competitions/${competition.id}`}
                  >
                    {competition.name}
                  </Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(groupedTeamsData).map((team, teamIndex) => {
              const { members, total_score } = groupedTeamsData[team];
              return members.map((member, memberIndex) => (
                <TableRow key={`${team}-${member.member_name}`}>
                  {memberIndex === 0 && (
                    <TableCell
                      className="font-semibold max-w-[100px] text-center"
                      rowSpan={members.length}
                    >
                      <div className="flex flex-col items-center">
                        {teamIndex === 0 && (
                          <Medal className="w-6 h-6 mb-1 text-yellow-500" />
                        )}
                        {teamIndex === 1 && (
                          <Medal className="w-6 h-6 mb-1 text-gray-400" />
                        )}
                        {teamIndex === 2 && (
                          <Medal className="w-6 h-6 mb-1 text-yellow-600" />
                        )}
                        {team}
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="max-w-[100px] sm:max-w-none">
                    <Link
                      className="text-green-800 hover:underline"
                      href={`/${member.member_id}`}
                    >
                      {member.member_name}
                    </Link>
                  </TableCell>
                  {competitions.map((competition) => (
                    <TableCell
                      className="text-center hidden sm:table-cell"
                      key={competition.id}
                    >
                      {member[competition.id.toLowerCase()]}
                    </TableCell>
                  ))}
                  {memberIndex === 0 && (
                    <TableCell className="text-center" rowSpan={members.length}>
                      {total_score}
                    </TableCell>
                  )}
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="individual">
        <Table>
          <TableCaption>
            Resultados obtenidos del{" "}
            <Link
              className="hover:underline italic"
              href="https://github.com/thewca/wcif/blob/master/specification.md"
            >
              WCA Competition Interchange Format
            </Link>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                className="text-center text-lg font-bold"
                colSpan={competitions.length + 3}
              >
                Marcador individual
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-bold" rowSpan={2}>
                <div className="flex items-center justify-center">
                  Competidores
                  <User className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead
                className="text-center font-bold hidden sm:table-cell"
                colSpan={competitions.length}
              >
                <div className="flex items-center justify-center">
                  Competencias
                  <Trophy className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead
                className="text-center font-bold max-w-[100px]"
                rowSpan={2}
              >
                Puntos totales
              </TableHead>
            </TableRow>
            <TableRow>
              {competitions.map((competition) => (
                <TableHead
                  className="text-center hidden sm:table-cell max-w-[100px]"
                  key={competition.id}
                >
                  <Link
                    className="hover:underline"
                    href={`https://live.worldcubeassociation.org/link/competitions/${competition.id}`}
                  >
                    {competition.name}
                  </Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {individualData.map((member, index) => (
              <TableRow key={member.member_id}>
                <TableCell className="max-w-[100px] sm:max-w-none">
                  <div className="flex gap-2 items-center">
                    {index === 0 && (
                      <Medal className="w-4 h-4 text-yellow-500" />
                    )}
                    {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                    {index === 2 && (
                      <Medal className="w-4 h-4 text-yellow-600" />
                    )}
                    <Link
                      className="text-green-800 hover:underline"
                      href={`/${member.member_id}`}
                    >
                      {member.member_name}
                    </Link>
                  </div>
                </TableCell>
                {competitions.map((competition) => (
                  <TableCell
                    className="text-center hidden sm:table-cell"
                    key={competition.id}
                  >
                    {member[competition.id.toLowerCase()]}
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  {member.total_score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
