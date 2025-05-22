import { Competitor, Team, TeamMember } from "@/app/types";
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

const calculateMemberTotal = (member: TeamMember): number => {
  return member.scores.reduce((total, score) => total + score.score, 0);
};

const calculateTeamTotal = (team: Team): number => {
  return team.members.reduce(
    (total, member) => total + calculateMemberTotal(member),
    0,
  );
};

const getCompetitionScore = (
  member: TeamMember,
  competition: {
    id: string;
    name: string;
  },
): number => {
  const score = member.scores.find((s) => s.competition.id === competition.id);
  return score ? score.score : 0;
};

const calculateCompetitorTotal = (competitor: Competitor): number => {
  return competitor.scores.reduce((total, score) => total + score.score, 0);
};

export function ScoreboardTable({
  teams,
  variant,
}: {
  teams: Team[];
  variant: "prs" | "kinch";
}) {
  const competitions = Array.from(
    new Set(
      teams.flatMap((team) =>
        team.members.flatMap((member) =>
          member.scores.map((score) => score.competition),
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
                  key={competition.id}
                  className="text-center min-w-[120px]"
                >
                  <Link
                    href={
                      variant === "prs"
                        ? `https://live.worldcubeassociation.org/link/competitions/${competition.id}`
                        : `https://comp-kinch.sylvermyst.com/#/competition/${competition.id}`
                    }
                  >
                    {competition.name}
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
                      <TableCell key={competition.id} className="text-center">
                        {getCompetitionScore(member, competition)}
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
                      key={competition.id}
                      className="text-center font-bold"
                    >
                      {team.members.reduce(
                        (total, member) =>
                          total + getCompetitionScore(member, competition),
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
  const competitions = Array.from(
    new Set(
      competitors.flatMap((competitor) =>
        competitor.scores.map((score) => score.competition),
      ),
    ),
  ).sort();

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
        const score = getCompetitionScore(competitor, competition);
        if (score > maxScore) {
          maxScore = score;
          competitorIds = [competitor.id];
        } else if (score === maxScore) {
          competitorIds.push(competitor.id);
        }
      });

      highestScores[competition.id] = { score: maxScore, competitorIds };
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
                  key={competition.id}
                  className="text-center min-w-[120px]"
                >
                  <Link
                    href={`https://live.worldcubeassociation.org/link/competitions/${competition.id}`}
                  >
                    {competition.name}
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
                  const score = getCompetitionScore(competitor, competition);
                  const isHighest = highestScores[
                    competition.id
                  ]!.competitorIds.includes(competitor.id);

                  return (
                    <TableCell
                      key={competition.id}
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
