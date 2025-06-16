import type {
  TransformedMember,
  TransformedTeam,
  Competitor,
} from "@/app/types";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@workspace/ui/components/table";
import { Medal, Trophy } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

const calculateMemberTotal = (member: TransformedMember): number => {
  const total = Object.keys(member)
    .filter((key) => key !== "id" && key !== "name")
    .reduce((sum, competition) => sum + (member[competition] as number), 0);

  return total;
};

const calculateTeamTotal = (team: TransformedTeam): number => {
  const total = team.members.reduce(
    (sum, member) => sum + calculateMemberTotal(member),
    0,
  );

  return total;
};

const calculateCompetitorTotal = (competitor: Competitor): number => {
  return Object.keys(competitor)
    .filter((key) => key !== "id" && key !== "name")
    .reduce((sum, competition) => sum + (competitor[competition] as number), 0);
};

export function ScoreboardTable({
  teams,
  variant,
}: {
  teams: TransformedTeam[];
  variant: "prs" | "kinch";
}) {
  // Extract all unique competition names from the first team member
  const competitions = Array.from(
    new Set(
      teams.flatMap((team) =>
        team.members.flatMap((member) =>
          Object.keys(member).filter((key) => key !== "id" && key !== "name"),
        ),
      ),
    ),
  ).sort();

  const sortedTeams = [...teams].sort((a, b) => {
    return calculateTeamTotal(b) - calculateTeamTotal(a);
  });

  return (
    <div className="relative overflow-auto">
      <div className="w-full min-w-max">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 w-[180px] bg-background">
                Equipo
              </TableHead>
              <TableHead className="sticky left-[180px] z-20 bg-background">
                Miembro
              </TableHead>
              {competitions.map((competition) => (
                <TableHead
                  key={competition}
                  className="text-center min-w-[120px]"
                >
                  <Link
                    href={
                      variant === "prs"
                        ? `https://live.worldcubeassociation.org/link/competitions/${competition.replace(/\s+/g, "")}`
                        : `https://comp-kinch.sylvermyst.com/#/competition/${competition.replace(/\s+/g, "")}`
                    }
                  >
                    {competition}
                  </Link>
                </TableHead>
              ))}
              <TableHead className="sticky right-0 z-20 text-center w-[100px] bg-background">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeams.map((team, teamIndex) => (
              <Fragment key={teamIndex}>
                {team.members.map((member, memberIndex) => (
                  <TableRow key={member.id}>
                    {memberIndex === 0 ? (
                      <TableCell
                        rowSpan={team.members.length + 1}
                        className="sticky left-0 z-20 align-middle font-medium bg-background"
                      >
                        <div className="flex items-center gap-2">
                          {teamIndex === 0 && (
                            <Trophy className="h-5 w-5 text-yellow-500" />
                          )}
                          {team.name}
                        </div>
                      </TableCell>
                    ) : null}
                    <TableCell className="sticky left-[180px] z-20 bg-background">
                      <Link
                        href={`https://www.cubingmexico.net/persons/${member.id}`}
                        className="hover:underline"
                      >
                        {member.name}
                      </Link>
                    </TableCell>
                    {competitions.map((competition) => (
                      <TableCell key={competition} className="text-center">
                        {member[competition] || 0}
                      </TableCell>
                    ))}
                    <TableCell className="sticky right-0 z-20 text-center font-medium bg-background">
                      {calculateMemberTotal(member)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow key={team.id + "-total"} className="bg-muted/50">
                  <TableCell className="sticky left-0 z-20 font-bold bg-muted/50">
                    Total
                  </TableCell>
                  {competitions.map((competition) => (
                    <TableCell
                      key={competition}
                      className="text-center font-bold"
                    >
                      {team.members.reduce(
                        (sum, member) =>
                          sum + ((member[competition] as number) || 0),
                        0,
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="sticky right-0 z-20 text-center font-bold bg-muted/50">
                    {calculateTeamTotal(team)}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function IndividualScoreboardTable({
  competitors,
}: {
  competitors: Competitor[];
}) {
  // Extract all competition names from the competitors
  const competitions = Array.from(
    new Set(
      competitors.flatMap((competitor) =>
        Object.keys(competitor).filter((key) => key !== "id" && key !== "name"),
      ),
    ),
  ).sort();

  // Sort competitors by their total score
  const sortedCompetitors = [...competitors].sort((a, b) => {
    return calculateCompetitorTotal(b) - calculateCompetitorTotal(a);
  });

  const getHighestScores = () => {
    const highestScores: Record<
      string,
      { score: number; competitorIds: string[] }
    > = {};

    competitions.forEach((competition) => {
      let maxScore = 0;
      let competitorIds: string[] = [];

      competitors.forEach((competitor) => {
        const score = competitor[competition] as number;
        if (score > maxScore) {
          maxScore = score;
          competitorIds = [competitor.id];
        } else if (score === maxScore) {
          competitorIds.push(competitor.id);
        }
      });

      highestScores[competition] = { score: maxScore, competitorIds };
    });

    return highestScores;
  };

  const highestScores = getHighestScores();

  return (
    <div className="relative overflow-auto">
      <div className="w-full min-w-max">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 w-[60px] bg-background text-center">
                Posición
              </TableHead>
              <TableHead className="sticky left-[60px] z-20 w-[180px] bg-background">
                Competidor
              </TableHead>
              {competitions.map((competition) => (
                <TableHead
                  key={competition}
                  className="text-center min-w-[120px]"
                >
                  <Link
                    href={`https://live.worldcubeassociation.org/link/competitions/${competition.replace(/\s+/g, "")}`}
                  >
                    {competition}
                  </Link>
                </TableHead>
              ))}
              <TableHead className="sticky right-0 z-20 text-center w-[100px] bg-background">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompetitors.map((competitor, index) => (
              <TableRow
                key={competitor.id}
                className={index < 3 ? "bg-muted/20" : ""}
              >
                <TableCell className="sticky left-0 z-20 bg-background text-center font-medium">
                  {index === 0 ? (
                    <Trophy className="h-5 w-5 text-yellow-500 mx-auto" />
                  ) : index === 1 ? (
                    <Medal className="h-5 w-5 text-gray-400 mx-auto" />
                  ) : index === 2 ? (
                    <Medal className="h-5 w-5 text-amber-700 mx-auto" />
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell className="sticky left-[60px] z-20 bg-background font-medium whitespace-nowrap">
                  <Link
                    href={`https://www.cubingmexico.net/persons/${competitor.id}`}
                    className="hover:underline"
                  >
                    {competitor.name}
                  </Link>
                </TableCell>
                {competitions.map((competition) => {
                  const score = competitor[competition] as number;
                  const isHighest = highestScores[
                    competition
                  ]!.competitorIds.includes(competitor.id);

                  return (
                    <TableCell
                      key={competition}
                      className={`text-center ${isHighest ? "font-bold" : ""}`}
                    >
                      {isHighest ? (
                        <span className="inline-flex items-center">
                          {score}
                          <Trophy className="h-3 w-3 text-yellow-500 ml-1" />
                        </span>
                      ) : (
                        score
                      )}
                    </TableCell>
                  );
                })}
                <TableCell className="sticky right-0 z-20 text-center font-bold bg-background">
                  {calculateCompetitorTotal(competitor)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
