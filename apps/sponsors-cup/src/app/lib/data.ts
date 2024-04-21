/* eslint-disable no-await-in-loop -- . */
/* eslint-disable no-console -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import type { Competition, Member, TableData } from './definitions';

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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch table data.');
  }
}

export async function fetchCompetitions() {
  noStore();

  try {
    const data = await sql<Competition>`SELECT * FROM Competitions WHERE CURRENT_DATE BETWEEN startDate AND endDate OR endDate < CURRENT_DATE ORDER BY startDate ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch competitions data.');
  }
}

export async function insertCompetitions() {
  noStore();

  try {
    const comps = await fetch(
      'https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/MX.json'
    ).then((res) => res.json()) as { items: Competition[] };

    const filteredComps = comps.items.filter((comp: Competition) => {
      const fromDate = new Date(comp.date.from);
      const month = fromDate.getMonth();
      const year = fromDate.getFullYear();
      return year === 2024 && month >= 3 && month <= 6;
    });

    for (const comp of filteredComps) {
      await sql`INSERT INTO Competitions (id, name, startDate, endDate) VALUES (${comp.id}, ${comp.name}, ${comp.date.from}, ${comp.date.till}) ON CONFLICT (id) DO NOTHING;`;
    }
  } catch (error) {
    throw new Error('Failed to fetch and insert competitions');
  }
}

export async function insertNewScores() {
  noStore();

  const membersData = await sql<Member>`SELECT * FROM Members`;
  const competitionsData = await sql<Competition>`SELECT * FROM Competitions`;

  const members = membersData.rows;
  const competitions = competitionsData.rows;

  try {
    for (const member of members) {
      for (const competition of competitions) {
        await sql`
          INSERT INTO Scores (member_id, competition_id, score) 
          VALUES (${member.id}, ${competition.id}, 0)
          ON CONFLICT (member_id, competition_id) DO NOTHING;
        `;
      }
    }
  } catch (error) {
    throw new Error('Failed to insert new scores');
  }
}

export async function updateScores() {
  noStore();

  try {
    const dataCompetitions = await sql<Competition>`SELECT * FROM Competitions WHERE endDate = CURRENT_DATE`;
    const comps = dataCompetitions.rows;
    for (const comp of comps) {
      const compWcif = await fetch(
        `https://www.worldcubeassociation.org/api/v0/competitions/${comp.id}/wcif/public`
      ).then((res) => res.json()) as Competition;

      const dataMembers = await sql<Member>`SELECT * FROM Members`

      const participatingMembers = dataMembers.rows.filter(member => compWcif.persons.some(person => person.wcaId === member.id)).map(member => {
        const person = compWcif.persons.find(pers => pers.wcaId === member.id);
        return person && { ...member, personId: person.registrantId };
      });

      const membersPersonalBests = participatingMembers.map(member => {
        const person = compWcif.persons.find(pers => pers.wcaId === member?.id);
        if (person) {
          return {
            id: member?.id,
            personId: member?.personId,
            personalBests: person.personalBests.map(({ eventId, best, type }) => ({ eventId, best, type }))
          };
        }
        return { id: member?.id, personId: member?.personId, personalBests: [] };
      });

      const personalBestsBroken = membersPersonalBests.map(({ id, personId, personalBests }) => {
        const bestsBroken = compWcif.events.flatMap(event =>
          event.rounds.flatMap(round =>
            round.results
              .filter(result => result.personId === personId && result.best !== -1 && result.average !== -1 && result.average !== 0)
              .map(result => {
                const singlePB = personalBests.find(pb => pb.eventId === event.id && pb.type === 'single');
                const averagePB = personalBests.find(pb => pb.eventId === event.id && pb.type === 'average');

                if ((singlePB && result.best < singlePB.best) && (averagePB && result.average < averagePB.best)) {
                  console.log(`${id} broke both PRs for ${event.id} with single: ${result.best} and average: ${result.average}`)
                  return { prs: 2 };
                } else if (singlePB && result.best < singlePB.best) {
                  console.log(`${id} broke single PR for ${event.id} with ${result.best}`);
                  return { prs: 1 };
                } else if (averagePB && result.average < averagePB.best) {
                  console.log(` ${id} broke average PR for ${event.id} with ${result.average}`);
                  return { prs: 1 };
                } else {
                  return { prs: 0 };
                }
              })
          )
        );

        const totalPrsBroken = bestsBroken.reduce((total, current) => total + current.prs, 0);
        console.log('-------------------')

        return { id, timesBroken: totalPrsBroken };
      });

      for (const best of personalBestsBroken) {
        await sql<Competition>`UPDATE Scores SET score = score + ${best.timesBroken} WHERE member_id = ${best.id} AND competition_id = ${comp.id}`;
      }

      const scoresAndTeams = await sql<Competition>`
        SELECT Members.team_id, SUM(Scores.score) as total_score
        FROM Scores 
        INNER JOIN Members ON Scores.member_id = Members.id
        WHERE Scores.competition_id = ${comp.id}
        GROUP BY Members.team_id`;

      for (let row of scoresAndTeams.rows as any) {
        await sql<Competition>`UPDATE Teams SET total_points = total_points + ${row.total_score} WHERE id = ${row.team_id}`;
      }
    }
  } catch (error) {
    throw new Error('Failed to update scores');
  }
}

export async function resetScores(competitionId: string) {
  noStore();

  try {
    await sql<Competition>`UPDATE Scores SET score = 0 WHERE competition_id = ${competitionId}`;

    const scoresAndTeams = await sql<Competition>`
      SELECT Members.team_id, SUM(Scores.score) as total_score
      FROM Scores 
      INNER JOIN Members ON Scores.member_id = Members.id
      WHERE Scores.competition_id = ${competitionId}
      GROUP BY Members.team_id`;

    for (let row of scoresAndTeams.rows as any) {
      await sql<Competition>`UPDATE Teams SET total_points = 0 WHERE id = ${row.team_id}`;
    }
  } catch (error) {
    throw new Error('Failed to reset scores');
  }
}