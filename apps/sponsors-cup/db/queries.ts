import { Competitor, TransformedTeam } from "@/app/types";
import { db } from ".";
import {
  sponsoredTeam,
  sponsoredTeamMember,
  sponsoredCompetitionScore,
  person,
  competition,
} from "./schema";
import { eq, and } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";

export async function getPRScoreboard(): Promise<TransformedTeam[]> {
  return await unstable_cache(
    async () => {
      try {
        const rawData = await db
          .select({
            teamId: sponsoredTeam.id,
            teamName: sponsoredTeam.name,
            memberId: person.id,
            memberName: person.name,
            competitionName: competition.name,
            competitionDate: competition.startDate,
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

        const teamMap = new Map<string, TransformedTeam>();
        const competitions = new Map<string, Date>();

        rawData.forEach((row) => {
          if (row.competitionName && row.competitionDate) {
            if (!competitions.has(row.competitionName)) {
              competitions.set(row.competitionName, row.competitionDate);
            }
          }

          if (!teamMap.has(row.teamId)) {
            teamMap.set(row.teamId, {
              id: row.teamId,
              name: row.teamName,
              members: [],
            });
          }

          const team = teamMap.get(row.teamId)!;

          let member = team.members.find((m) => m.id === row.memberId);
          if (!member) {
            member = {
              id: row.memberId,
              name: row.memberName!,
            };
            team.members.push(member);
          }

          if (row.competitionName) {
            if (row.score !== null && row.score !== undefined) {
              member[row.competitionName] = row.score;
            }
          }
        });

        const competitionNamesArray = Array.from(competitions.entries())
          .sort(([, dateA], [, dateB]) => dateA.getTime() - dateB.getTime())
          .map(([name]) => name);

        teamMap.forEach((team) => {
          team.members.forEach((member) => {
            competitionNamesArray.forEach((compName) => {
              if (!(compName in member)) {
                member[compName] = 0;
              }
            });
          });
        });

        return Array.from(teamMap.values());
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [],
    {
      revalidate: 300,
      tags: ["prs"],
    },
  )();
}

export async function getKinchScoreboard(): Promise<TransformedTeam[]> {
  return await unstable_cache(
    async () => {
      try {
        const rawData = await db
          .select({
            teamId: sponsoredTeam.id,
            teamName: sponsoredTeam.name,
            memberId: person.id,
            memberName: person.name,
            competitionId: sponsoredCompetitionScore.competitionId,
            competitionName: competition.name,
            competitionDate: competition.startDate,
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
          )
          .orderBy(sponsoredTeam.name, person.name);

        // Step 1: Collect all unique competitions and their details.
        const competitionDetails = new Map<
          string,
          { id: string; name: string; date: Date }
        >();
        rawData.forEach((row) => {
          if (row.competitionId && row.competitionName && row.competitionDate) {
            competitionDetails.set(row.competitionId, {
              id: row.competitionId,
              name: row.competitionName,
              date: row.competitionDate,
            });
          }
        });

        // Step 2: Identify which competition names are used more than once.
        const nameCounts = new Map<string, number>();
        competitionDetails.forEach((comp) => {
          nameCounts.set(comp.name, (nameCounts.get(comp.name) || 0) + 1);
        });

        // Step 3: Create a map from competition ID to a unique display name.
        const compIdToDisplayName = new Map<string, string>();
        competitionDetails.forEach((comp) => {
          const isDuplicate = (nameCounts.get(comp.name) || 0) > 1;
          // Disambiguate with the date (YYYY-MM-DD) if the name is not unique.
          const displayName = isDuplicate
            ? `${comp.name} (${comp.date.toISOString().split("T")[0]})`
            : comp.name;
          compIdToDisplayName.set(comp.id, displayName);
        });

        // Step 4: Build the scoreboard data structure.
        const teamMap = new Map<string, TransformedTeam>();
        rawData.forEach((row) => {
          if (!row.teamId || !row.teamName) return;

          if (!teamMap.has(row.teamId)) {
            teamMap.set(row.teamId, {
              id: row.teamId,
              name: row.teamName,
              members: [],
            });
          }
          const team = teamMap.get(row.teamId)!;

          let member = team.members.find((m) => m.id === row.memberId);
          if (!member) {
            if (!row.memberId || !row.memberName) return;
            member = {
              id: row.memberId,
              name: row.memberName,
            };
            team.members.push(member);
          }

          // Use the unique display name for the score property.
          if (row.competitionId) {
            const displayName = compIdToDisplayName.get(row.competitionId);
            if (displayName) {
              member[displayName] = row.score ?? 0;
            }
          }
        });

        // Step 5: Get the sorted list of unique competition column names.
        const competitionNamesArray = Array.from(competitionDetails.values())
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map((comp) => compIdToDisplayName.get(comp.id)!);

        // Step 6: Ensure all members have a score for every competition.
        teamMap.forEach((team) => {
          team.members.forEach((member) => {
            competitionNamesArray.forEach((compName) => {
              if (!(compName in member)) {
                member[compName] = 0;
              }
            });
          });
        });

        return Array.from(teamMap.values());
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [],
    {
      revalidate: 300,
      tags: ["kinch"],
    },
  )();
}

export async function getIndividualScoreboard(): Promise<Competitor[]> {
  return await unstable_cache(
    async () => {
      try {
        const memberScores = await db
          .select({
            memberId: person.id,
            memberName: person.name,
            competitionId: sponsoredCompetitionScore.competitionId,
            competitionName: competition.name,
            competitionDate: competition.startDate,
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
        const competitions = new Map<string, Date>();

        memberScores.forEach((row) => {
          if (!row.memberId || !row.memberName) {
            return;
          }

          if (row.competitionName && row.competitionDate) {
            if (!competitions.has(row.competitionName)) {
              competitions.set(row.competitionName, row.competitionDate);
            }
          }

          if (!competitorMap.has(row.memberId)) {
            competitorMap.set(row.memberId, {
              id: row.memberId,
              name: row.memberName,
            });
          }

          const competitor = competitorMap.get(row.memberId)!;

          if (row.competitionName) {
            competitor[row.competitionName] = row.score ?? 0;
          }
        });

        const competitionNamesArray = Array.from(competitions.entries())
          .sort(([, dateA], [, dateB]) => dateA.getTime() - dateB.getTime())
          .map(([name]) => name);

        competitorMap.forEach((competitor) => {
          competitionNamesArray.forEach((compName) => {
            if (!(compName in competitor)) {
              competitor[compName] = 0;
            }
          });
        });

        return Array.from(competitorMap.values());
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [],
    {
      revalidate: 300,
      tags: ["individual"],
    },
  )();
}
