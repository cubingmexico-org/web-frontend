/* eslint-disable no-await-in-loop -- . */
/* eslint-disable no-console -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import type {
  Competition,
  IndividualTableData,
  TableData,
} from "./definitions";

export async function fetchTableData() {
  noStore();

  try {
    const data = await sql<TableData>`
    SELECT 
      Teams.name AS "teamName",
      json_agg(
      json_build_object(
        'id', Members.id,
        'name', Members.name, 
        'scores', (
            SELECT json_object_agg(Competitions.id, Scores.score)
            FROM Scores
            INNER JOIN Competitions ON Scores.competition_id = Competitions.id
            WHERE Scores.member_id = Members.id
          )
        )
      ) AS members,
      Teams.total_points AS "totalPoints"
    FROM 
      Teams
    INNER JOIN 
      Members ON Teams.id = Members.team_id
    GROUP BY 
      Teams.name, Teams.sponsor_id, Teams.total_points
    ORDER BY Teams.total_points DESC, Teams.sponsor_id
  `;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch table data.");
  }
}

export async function fetchIndividualTableData() {
  noStore();

  try {
    const data = await sql<IndividualTableData>`
    SELECT 
      Members.id AS "memberId",
      Members.name AS "memberName",
      Teams.name AS "teamName",
      json_object_agg(Competitions.id, Scores.score) AS "scores",
      SUM(Scores.score) AS "totalScore"
    FROM 
      Members
    INNER JOIN 
      Teams ON Members.team_id = Teams.id
    INNER JOIN 
      Scores ON Members.id = Scores.member_id
    INNER JOIN 
      Competitions ON Scores.competition_id = Competitions.id
    WHERE 
      (Competitions.startDate <= CURRENT_DATE AND Competitions.endDate >= CURRENT_DATE) 
      OR Competitions.endDate < CURRENT_DATE
    GROUP BY 
      Members.id, Teams.name
    ORDER BY 
      sum(Scores.score) DESC
  `;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch table data.");
  }
}

export async function fetchIndividualData(memberId: string) {
  noStore();

  try {
    const data = await sql`
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
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch table data.");
  }
}

export async function fetchCompetitions() {
  noStore();

  try {
    const data =
      await sql<Competition>`SELECT * FROM Competitions WHERE CURRENT_DATE BETWEEN startDate AND endDate OR endDate < CURRENT_DATE ORDER BY startDate ASC`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch competitions data.");
  }
}
