import { Competitor, Team } from "@/app/types";
import { db } from ".";
import {
  sponsoredTeam,
  sponsoredTeamMember,
  sponsoredCompetitionScore,
  person,
  competition,
} from "./schema";
import { eq, and } from "drizzle-orm";

export async function getPRScoreboard() {
  const teams = await db
    .select({
      teamId: sponsoredTeam.id,
      teamName: sponsoredTeam.name,
      memberId: person.id,
      memberName: person.name,
      competitionName: competition.name,
      score: sponsoredCompetitionScore.score,
    })
    .from(sponsoredTeam)
    .innerJoin(
      sponsoredTeamMember,
      eq(sponsoredTeamMember.sponsoredTeamId, sponsoredTeam.id),
    )
    .innerJoin(person, eq(person.id, sponsoredTeamMember.personId))
    .leftJoin(
      sponsoredCompetitionScore,
      and(
        eq(
          sponsoredCompetitionScore.sponsoredTeamMemberId,
          sponsoredTeamMember.id,
        ),
        eq(sponsoredCompetitionScore.type, "pr"),
      ),
    )
    .leftJoin(
      competition,
      eq(competition.id, sponsoredCompetitionScore.competitionId),
    );

  const teamMap = new Map<string, Team>();

  teams.forEach((row) => {
    if (!teamMap.has(row.teamId)) {
      teamMap.set(row.teamId, {
        id: row.teamId,
        name: row.teamName,
        members: [],
      });
    }

    const team = teamMap.get(row.teamId);

    let member = team?.members.find((m) => m.id === row.memberId);
    if (!member) {
      member = {
        id: row.memberId,
        name: row.memberName!,
        scores: [],
      };
      team?.members.push(member);
    }

    if (row.competitionName) {
      member.scores.push({
        competition: row.competitionName,
        score: row.score ?? 0,
      });
    }
  });

  return Array.from(teamMap.values());
}

export async function getKinchScoreboard() {
  const teams = await db
    .select({
      teamId: sponsoredTeam.id,
      teamName: sponsoredTeam.name,
      memberId: person.id,
      memberName: person.name,
      competitionName: competition.name,
      score: sponsoredCompetitionScore.score,
    })
    .from(sponsoredTeam)
    .innerJoin(
      sponsoredTeamMember,
      eq(sponsoredTeamMember.sponsoredTeamId, sponsoredTeam.id),
    )
    .innerJoin(person, eq(person.id, sponsoredTeamMember.personId))
    .leftJoin(
      sponsoredCompetitionScore,
      and(
        eq(
          sponsoredCompetitionScore.sponsoredTeamMemberId,
          sponsoredTeamMember.id,
        ),
        eq(sponsoredCompetitionScore.type, "kinch"),
      ),
    )
    .leftJoin(
      competition,
      eq(competition.id, sponsoredCompetitionScore.competitionId),
    );

  const teamMap = new Map<
    string,
    {
      id: string;
      name: string;
      members: {
        id: string;
        name: string;
        scores: {
          competition: string;
          score: number;
        }[];
      }[];
    }
  >();

  teams.forEach((row) => {
    if (!teamMap.has(row.teamId)) {
      teamMap.set(row.teamId, {
        id: row.teamId,
        name: row.teamName,
        members: [],
      });
    }

    const team = teamMap.get(row.teamId);

    let member = team?.members.find((m) => m.id === row.memberId);
    if (!member) {
      member = {
        id: row.memberId,
        name: row.memberName!,
        scores: [],
      };
      team?.members.push(member);
    }

    if (row.competitionName) {
      member.scores.push({
        competition: row.competitionName,
        score: row.score ?? 0,
      });
    }
  });

  return Array.from(teamMap.values());
}

export async function getIndividualScoreboard() {
  const memberScores = await db
    .select({
      memberId: person.id,
      memberName: person.name,
      competitionName: competition.name,
      score: sponsoredCompetitionScore.score,
    })
    .from(sponsoredTeamMember)
    .innerJoin(person, eq(person.id, sponsoredTeamMember.personId))
    .leftJoin(
      sponsoredCompetitionScore,
      and(
        eq(
          sponsoredCompetitionScore.sponsoredTeamMemberId,
          sponsoredTeamMember.id,
        ),
        eq(sponsoredCompetitionScore.type, "pr"),
      ),
    )
    .leftJoin(
      competition,
      eq(competition.id, sponsoredCompetitionScore.competitionId),
    );

  const competitorMap = new Map<string, Competitor>();

  memberScores.forEach((row) => {
    if (!row.memberId || !row.memberName) {
      // Skip if essential member data is missing
      return;
    }

    if (!competitorMap.has(row.memberId)) {
      competitorMap.set(row.memberId, {
        id: row.memberId,
        name: row.memberName,
        scores: [],
      });
    }

    const competitor = competitorMap.get(row.memberId);

    if (competitor && row.competitionName) {
      competitor.scores.push({
        competition: row.competitionName,
        score: row.score ?? 0,
      });
    }
  });

  return Array.from(competitorMap.values());
}
