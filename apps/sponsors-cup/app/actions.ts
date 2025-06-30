"use server";

import { db } from "@/db";
import type { Competition as WCIFCompetition } from "./types/wcif";
import {
  competition,
  person,
  sponsoredCompetitionScore,
  sponsoredTeamMember,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWCIFCompetition(id: string): Promise<WCIFCompetition> {
  const response = await fetch(
    `https://www.worldcubeassociation.org/api/v0/competitions/${id}/wcif/public`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch competition");
  }

  const competition = (await response.json()) as WCIFCompetition;

  return competition;
}

export async function updateScores(): Promise<void> {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 6);
  const dataCompetitions = await db
    .select()
    .from(competition)
    .where(eq(competition.endDate, currentDate));
  for (const competition of dataCompetitions) {
    const wcif = await getWCIFCompetition(competition.id);

    const dataMembers = await db.select().from(sponsoredTeamMember);

    const participatingMembers = dataMembers
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
                  console.log(
                    `${id} broke single PR for ${event.id} with ${result.best}`,
                  );
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
                  console.log(
                    `${id} broke average PR for ${event.id} with ${result.average}`,
                  );
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
        console.log("-------------------");

        return { id, timesBroken: totalPrsBroken };
      },
    );

    for (const best of personalBestsBroken) {
      await db.update(sponsoredCompetitionScore).set({
        score: best.timesBroken,
      });
      // .where(
      //   and(
      //     eq(sponsoredCompetitionScore.sponsoredTeamMemberId, best.id),
      //     eq(sponsoredCompetitionScore.competitionId, competition.id),
      //   )
      // );
    }
  }
}

export async function resetScores(competitionId: string): Promise<void> {
  await db
    .update(sponsoredCompetitionScore)
    .set({
      score: 0,
    })
    .where(eq(sponsoredCompetitionScore.competitionId, competitionId));
}

export async function findCompetitors(competitionId: string) {
  const wcif = await getWCIFCompetition(competitionId);

  const dataMembers = await db
    .select({
      id: sponsoredTeamMember.id,
      personId: sponsoredTeamMember.personId,
      name: person.name,
    })
    .from(sponsoredTeamMember)
    .innerJoin(person, eq(person.id, sponsoredTeamMember.personId));

  const participatingMembers = dataMembers
    .filter((member) =>
      wcif.persons.some((person) => person.wcaId === member.personId),
    )
    .map((member) => {
      const person = wcif.persons.find((pers) => pers.wcaId === member.personId);
      if (person) {
        return {
          id: member.id,
          personId: member.personId,
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
