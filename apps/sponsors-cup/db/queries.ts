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
            // competitionId: sponsoredCompetitionScore.competitionId, // Not strictly needed for the new structure if only name is used as key
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

        const teamMap = new Map<string, TransformedTeam>();
        const allCompetitionNames = new Set<string>();

        rawData.forEach((row) => {
          // Collect all unique competition names from the dataset
          // This ensures that even if a member has a null score for an existing competition,
          // that competition column will be created.
          if (row.competitionName) {
            allCompetitionNames.add(row.competitionName);
          }

          // Ensure team exists in the map
          if (!teamMap.has(row.teamId)) {
            teamMap.set(row.teamId, {
              id: row.teamId,
              name: row.teamName,
              members: [],
            });
          }

          const team = teamMap.get(row.teamId)!; // Safe due to the check above

          // Find or create member
          let member = team.members.find((m) => m.id === row.memberId);
          if (!member) {
            member = {
              id: row.memberId,
              name: row.memberName!, // Assuming memberName is expected to be non-null
              // Competition scores will be added directly as properties
            };
            team.members.push(member);
          }

          // Add score for the current competition if available
          if (row.competitionName) {
            // Use score if present, otherwise it will be defaulted to 0 in the post-processing step
            // This handles cases where a score might be explicitly null from the DB for a competition
            // but we still want to represent that competition.
            // The original code's `row.score ?? 0` is effectively achieved by the post-processing.
            if (row.score !== null && row.score !== undefined) {
              member[row.competitionName] = row.score;
            }
          }
        });

        // Post-processing: Ensure all members have all competition columns, defaulting to 0
        const competitionNamesArray = Array.from(allCompetitionNames);
        teamMap.forEach((team) => {
          team.members.forEach((member) => {
            competitionNamesArray.forEach((compName) => {
              if (!(compName in member)) {
                // If a member doesn't have a score for a competition (either no entry or score was null), set it to 0.
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
      revalidate: 3600,
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

        const teamMap = new Map<string, TransformedTeam>();
        const allCompetitionNames = new Set<string>();

        rawData.forEach((row) => {
          // Collect all unique competition names
          if (row.competitionName) {
            allCompetitionNames.add(row.competitionName);
          }

          // Ensure team exists in the map
          if (!teamMap.has(row.teamId)) {
            teamMap.set(row.teamId, {
              id: row.teamId,
              name: row.teamName,
              members: [],
            });
          }

          const team = teamMap.get(row.teamId)!; // Safe due to the check above

          // Find or create member
          let member = team.members.find((m) => m.id === row.memberId);
          if (!member) {
            member = {
              id: row.memberId,
              name: row.memberName!,
            };
            team.members.push(member);
          }

          // Add score for the current competition if available
          if (row.competitionName) {
            member[row.competitionName] = row.score ?? 0;
          }
        });

        // Post-processing: Ensure all members have all competition columns, defaulting to 0
        const competitionNamesArray = Array.from(allCompetitionNames);
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
      revalidate: 3600,
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
        const allCompetitionNames = new Set<string>();

        memberScores.forEach((row) => {
          if (!row.memberId || !row.memberName) {
            // Skip if essential member data is missing
            return;
          }

          // Collect all unique competition names
          if (row.competitionName) {
            allCompetitionNames.add(row.competitionName);
          }

          // Ensure competitor exists in the map
          if (!competitorMap.has(row.memberId)) {
            competitorMap.set(row.memberId, {
              id: row.memberId,
              name: row.memberName,
            });
          }

          const competitor = competitorMap.get(row.memberId)!; // Safe due to the check above

          // Add score for the current competition if available
          if (row.competitionName) {
            competitor[row.competitionName] = row.score ?? 0;
          }
        });

        // Post-processing: Ensure all competitors have all competition columns, defaulting to 0
        const competitionNamesArray = Array.from(allCompetitionNames);
        competitorMap.forEach((competitor) => {
          competitionNamesArray.forEach((compName) => {
            if (!(compName in competitor)) {
              // If a competitor doesn't have a score for a competition, set it to 0
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
      revalidate: 3600,
      tags: ["individual"],
    },
  )();
}
