/* eslint-disable no-await-in-loop -- . */
"use server";

import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@vercel/postgres";
import type { Competition } from "./types/unofficial-wca-api";
import type { Competition as WCIFCompetition } from "./types/wcif";
import type {
  CompetitorTable,
  Member,
  TableDataByCompetitor,
  TableDataByTeam,
} from "./types";

export async function fetchTeamsTable(
  competitions: Competition[],
): Promise<TableDataByTeam[]> {
  noStore();

  const competitionIds = competitions.map((comp) => comp.id);
  const maxStatements = competitionIds
    .map(
      (id) => `MAX(CASE WHEN competition_id = '${id}' THEN score END) AS ${id}`,
    )
    .join(",");

  const query = `
    WITH ScorePerMember AS (
      SELECT
        Teams.name AS team_name,
        Members.id AS member_id,
        Members.name AS member_name,
        Competitions.id AS competition_id,
        Scores.score
      FROM
        Teams
      JOIN
        Members ON Teams.id = Members.team_id
      JOIN
        Scores ON Members.id = Scores.member_id
      JOIN
        Competitions ON Scores.competition_id = Competitions.id
    ),
    CompetitionScores AS (
      SELECT
        team_name,
        member_id,
        member_name,
        ${maxStatements},
        SUM(score) AS total_score
      FROM
        ScorePerMember
      GROUP BY
        team_name, member_id, member_name
    )
    SELECT
      team_name,
      member_id,
      member_name,
      ${competitionIds.join(",")},
      total_score
    FROM
      CompetitionScores
    ORDER BY
      total_score DESC, team_name, member_name;
  `;

  const data = await sql.query<TableDataByTeam>(query);

  return data.rows;
}

export async function fetchIndividualTable(
  competitions: Competition[],
): Promise<TableDataByCompetitor[]> {
  noStore();

  const competitionIds = competitions.map((comp) => comp.id);
  const maxStatements = competitionIds
    .map(
      (id) => `MAX(CASE WHEN competition_id = '${id}' THEN score END) AS ${id}`,
    )
    .join(",");

  const query = `
  WITH ScorePerMember AS (
    SELECT
      Members.id AS member_id,
      Members.name AS member_name,
      Competitions.id AS competition_id,
      Scores.score
    FROM
      Members
    JOIN
      Scores ON Members.id = Scores.member_id
    JOIN
      Competitions ON Scores.competition_id = Competitions.id
  ),
  CompetitionScores AS (
    SELECT
      member_id,
      member_name,
      ${maxStatements},
      SUM(score) AS total_score
    FROM
      ScorePerMember
    GROUP BY
      member_id, member_name
  )
  SELECT
    member_id,
    member_name,
    ${competitionIds.join(",")},
    total_score
  FROM
    CompetitionScores
  ORDER BY
    total_score DESC, member_name;
`;

  const data = await sql.query<TableDataByCompetitor>(query);

  return data.rows;
}

export async function fetchCompetitorTable(
  memberId: string,
): Promise<CompetitorTable[]> {
  noStore();

  const data = await sql<CompetitorTable>`
    SELECT 
      Members.name as member_name, 
      Members.id as member_id, 
      Scores.score, 
      Competitions.name as competition_name, 
      Competitions.id as competition_id 
    FROM 
      Members 
    INNER JOIN 
      Scores ON Members.id = Scores.member_id 
    INNER JOIN 
      Competitions ON Scores.competition_id = Competitions.id 
    WHERE 
      Members.id = ${memberId} 
      AND (
        (Competitions.startDate <= CURRENT_DATE AND Competitions.endDate >= CURRENT_DATE) 
        OR Competitions.endDate < CURRENT_DATE
      )
    ORDER BY 
      Scores.score DESC
    `;

  return data.rows;
}

export async function fetchCompetitions(): Promise<Competition[]> {
  noStore();

  const data =
    await sql<Competition>`SELECT * FROM Competitions WHERE CURRENT_DATE BETWEEN startDate AND endDate OR endDate < CURRENT_DATE ORDER BY startDate ASC`;
  return data.rows;
}

export async function getWCIFCompetition(id: string): Promise<WCIFCompetition> {
  noStore();

  const response = await fetch(
    `https://www.worldcubeassociation.org/api/v0/competitions/${id}/wcif/public`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch competition");
  }

  const competition = (await response.json()) as WCIFCompetition;

  return competition;
}

export async function getCompetitions(): Promise<Competition[]> {
  noStore();

  const response = await fetch(
    "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/MX.json",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch competitions");
  }

  const competitions = (await response.json()) as { items: Competition[] };

  const filteredCompetitions = competitions.items.filter((competition) => {
    const fromDate = new Date(competition.date.from);
    const month = fromDate.getMonth();
    const year = fromDate.getFullYear();
    return year === 2024 && month >= 8 && month <= 11;
  });

  return filteredCompetitions;
}

export async function insertNewCompetition(): Promise<void> {
  noStore();

  const competitions = await getCompetitions();

  const membersData = await sql<Member>`SELECT * FROM Members`;

  for (const competition of competitions) {
    await sql`INSERT INTO Competitions (id, name, startDate, endDate) VALUES (${competition.id}, ${competition.name}, ${competition.date.from}, ${competition.date.till}) ON CONFLICT (id) DO NOTHING;`;
    for (const member of membersData.rows) {
      await sql`
        INSERT INTO Scores (member_id, competition_id, score) 
        VALUES (${member.id}, ${competition.id}, 0)
        ON CONFLICT (member_id, competition_id) DO NOTHING;
      `;
    }
  }
}

export async function updateScores(): Promise<void> {
  noStore();

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 6);
  const dataCompetitions =
    await sql<Competition>`SELECT * FROM Competitions WHERE endDate = ${currentDate.toISOString()}`;
  for (const competition of dataCompetitions.rows) {
    const wcif = await getWCIFCompetition(competition.id);

    const dataMembers = await sql<Member>`SELECT * FROM Members`;

    const participatingMembers = dataMembers.rows
      .filter((member) =>
        wcif.persons.some((person) => person.wcaId === member.id),
      )
      .map((member) => {
        const person = wcif.persons.find((pers) => pers.wcaId === member.id);
        return person && { ...member, personId: person.registrantId };
      });

    const membersPersonalBests = participatingMembers.map((member) => {
      const person = wcif.persons.find((pers) => pers.wcaId === member?.id);
      if (person) {
        return {
          id: member?.id,
          personId: member?.personId,
          personalBests: person.personalBests.map(
            ({ eventId, best, type }) => ({ eventId, best, type }),
          ),
        };
      }
      return {
        id: member?.id,
        personId: member?.personId,
        personalBests: [],
      };
    });

    const personalBestsBroken = membersPersonalBests.map(
      ({ id, personId, personalBests }) => {
        const bestsBroken = wcif.events.flatMap((event) =>
          event.rounds.flatMap((round) =>
            round.results
              .filter(
                (result) =>
                  result.personId === personId &&
                  result.best !== -1 &&
                  result.best !== -2,
              )
              .map((result) => {
                let singlePB = personalBests.find(
                  (pb) => pb.eventId === event.id && pb.type === "single",
                );
                let averagePB = personalBests.find(
                  (pb) => pb.eventId === event.id && pb.type === "average",
                );

                let prsBroken = 0;

                if (!singlePB || result.best <= singlePB.best) {
                  // console.log(
                  //   `${id} broke single PR for ${event.id} with ${result.best}`,
                  // );
                  if (!singlePB) {
                    singlePB = {
                      eventId: event.id,
                      type: "single",
                      best: result.best,
                    };
                    personalBests.push(singlePB);
                  } else {
                    singlePB.best = result.best;
                  }
                  prsBroken++;
                }

                if (
                  (!averagePB || result.average <= averagePB.best) &&
                  result.average !== -1 &&
                  result.average !== 0
                ) {
                  // console.log(
                  //   `${id} broke average PR for ${event.id} with ${result.average}`,
                  // );
                  if (!averagePB) {
                    averagePB = {
                      eventId: event.id,
                      type: "average",
                      best: result.average,
                    };
                    personalBests.push(averagePB);
                  } else {
                    averagePB.best = result.average;
                  }
                  prsBroken++;
                }

                return { prs: prsBroken };
              }),
          ),
        );

        const totalPrsBroken = bestsBroken.reduce(
          (total, current) => total + current.prs,
          0,
        );
        // console.log("-------------------");

        return { id, timesBroken: totalPrsBroken };
      },
    );

    for (const best of personalBestsBroken) {
      await sql<Competition>`UPDATE MemberScores SET score = score + ${best.timesBroken} WHERE member_id = ${best.id} AND competition_id = ${competition.id}`;
    }
  }
}

export async function resetScores(competitionId: string): Promise<void> {
  noStore();

  await sql`UPDATE Scores SET score = 0 WHERE competition_id = ${competitionId}`;
}

export async function findCompetitors(competitionId: string): Promise<
  {
    personId: number;
    id: string;
    name: string;
  }[]
> {
  noStore();

  const wcif = await getWCIFCompetition(competitionId);

  const dataMembers = await sql<Member>`SELECT * FROM Members`;

  const participatingMembers = dataMembers.rows
    .filter((member) =>
      wcif.persons.some((person) => person.wcaId === member.id),
    )
    .map((member) => {
      const person = wcif.persons.find((pers) => pers.wcaId === member.id);
      if (person) {
        return {
          personId: person.registrantId,
          id: member.id,
          name: member.name,
        };
      }
      return undefined;
    })
    .filter(
      (member): member is Exclude<typeof member, undefined> =>
        member !== undefined,
    );

  return participatingMembers;
}
