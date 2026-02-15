"use cache";

import "server-only";
import { db } from "@/db";
import {
  competition,
  Person,
  person,
  rankAverage,
  rankSingle,
  result,
  state,
  team,
  teamMember,
} from "@/db/schema";
import {
  and,
  count,
  ilike,
  gt,
  eq,
  inArray,
  asc,
  desc,
  sql,
  or,
} from "drizzle-orm";
import { type GetMembersSchema } from "./validations";
import { cacheLife, cacheTag } from "next/cache";

export async function getTeamInfo(stateId: string) {
  cacheLife("hours");
  cacheTag(`team-info-${stateId}`);

  try {
    const data = await db
      .select({
        name: team.name,
        description: team.description,
        image: team.image,
        coverImage: team.coverImage,
        state: state.name,
        founded: team.founded,
        socialLinks: team.socialLinks,
        isActive: team.isActive,
      })
      .from(team)
      .innerJoin(state, eq(team.stateId, state.id))
      .where(eq(team.stateId, stateId));

    return data[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getTotalMembers(stateId: string) {
  cacheLife("hours");
  cacheTag(`total-members-${stateId}`);

  try {
    const data = await db
      .select({ count: count() })
      .from(person)
      .where(eq(person.stateId, stateId));

    return data[0]?.count ?? 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
}

export async function getTeamCompetitions(stateId: string) {
  cacheLife("hours");
  cacheTag(`team-competitions-${stateId}`);

  try {
    return await db
      .select({
        id: competition.id,
        name: competition.name,
        cityName: competition.cityName,
        venue: competition.venue,
        startDate: competition.startDate,
        endDate: competition.endDate,
        latitudeMicrodegrees: competition.latitudeMicrodegrees,
        longitudeMicrodegrees: competition.longitudeMicrodegrees,
      })
      .from(competition)
      .where(eq(competition.stateId, stateId))
      .orderBy(competition.startDate);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getTeamPodiums(stateId: string) {
  cacheLife("hours");
  cacheTag(`team-podiums-${stateId}`);

  try {
    return await db
      .select({ pos: result.pos })
      .from(result)
      .innerJoin(person, eq(result.personId, person.wcaId))
      .where(
        and(
          eq(person.stateId, stateId),
          or(eq(result.roundTypeId, "f"), eq(result.roundTypeId, "c")),
          inArray(result.pos, [1, 2, 3]),
          gt(result.best, 0),
        ),
      );
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getSingleNationalRecords(stateId: string) {
  cacheLife("hours");
  cacheTag(`single-national-records-${stateId}`);

  try {
    return await db
      .select({ eventId: rankSingle.eventId })
      .from(rankSingle)
      .innerJoin(person, eq(rankSingle.personId, person.wcaId))
      .where(and(eq(person.stateId, stateId), eq(rankSingle.countryRank, 1)));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getAverageNationalRecords(stateId: string) {
  cacheLife("hours");
  cacheTag(`average-national-records-${stateId}`);

  try {
    return await db
      .select({ eventId: rankAverage.eventId })
      .from(rankAverage)
      .innerJoin(person, eq(rankAverage.personId, person.wcaId))
      .where(and(eq(person.stateId, stateId), eq(rankAverage.countryRank, 1)));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getMembers(
  input: GetMembersSchema,
  stateId: Person["stateId"],
) {
  cacheLife("hours");
  cacheTag(`members-list-${stateId}`);

  try {
    const offset = (input.page - 1) * input.perPage;

    const where = and(
      eq(person.stateId, stateId!),
      input.name ? ilike(person.name, `%${input.name}%`) : undefined,
      input.gender.length > 0
        ? inArray(person.gender, input.gender)
        : undefined,
      // input.specialties.length > 0
      //   ? inArray(teamMember.specialties, input.specialties)
      //   : undefined,
    );

    const orderBy =
      input.sort.length > 0
        ? input.sort.map((item) => {
            switch (item.id) {
              case "isAdmin":
                return item.desc
                  ? desc(teamMember.isAdmin)
                  : asc(teamMember.isAdmin);
              case "stateRecords":
                return item.desc
                  ? desc(sql`"state_records"`)
                  : asc(sql`"state_records"`);
              case "podiums":
                return item.desc ? desc(sql`"podiums"`) : asc(sql`"podiums"`);
              case "specialties": // TODO: Fix this
                return item.desc
                  ? desc(teamMember.specialties)
                  : asc(teamMember.specialties);
              default:
                return item.desc ? desc(person[item.id]) : asc(person[item.id]);
            }
          })
        : [asc(person.name)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          wcaId: person.wcaId,
          name: person.name,
          gender: person.gender,
          isAdmin: teamMember.isAdmin,
          podiums: count(
            sql`CASE 
                      WHEN ${result.roundTypeId} IN ('f', 'c') 
                      AND ${result.pos} IN (1, 2, 3) 
                      AND ${result.best} > 0 
                      THEN 1 
                    END`,
          ).as("podiums"),
          stateRecords: sql`(
                SELECT CAST((
                  (SELECT COUNT(*)
                    FROM ranks_single
                    WHERE person_id = ${person.wcaId}
                    AND state_rank = 1)
                  +
                  (SELECT COUNT(*)
                    FROM ranks_average
                    WHERE person_id = ${person.wcaId}
                    AND state_rank = 1)
                ) AS INTEGER) AS state_records
              )`.as("state_records"),
          specialties: teamMember.specialties,
        })
        .from(person)
        .leftJoin(teamMember, eq(person.wcaId, teamMember.personId))
        .innerJoin(result, eq(person.wcaId, result.personId))
        .limit(input.perPage)
        .offset(offset)
        .where(where)
        .groupBy(
          person.wcaId,
          person.name,
          person.gender,
          teamMember.isAdmin,
          teamMember.specialties,
        )
        .orderBy(...orderBy);

      const total = (await tx
        .select({
          count: count(),
        })
        .from(person)
        .leftJoin(teamMember, eq(person.wcaId, teamMember.personId))
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)) as number;

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / input.perPage);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export async function getMembersGenderCounts(stateId: Person["stateId"]) {
  cacheLife("hours");
  cacheTag(`members-gender-count-${stateId}`);

  try {
    return await db
      .select({
        gender: person.gender,
        count: count(),
      })
      .from(person)
      .where(eq(person.stateId, stateId!))
      .groupBy(person.gender)
      .having(gt(count(), 0))
      .orderBy(person.gender)
      .then((res) =>
        res.reduce(
          (acc, { gender, count }) => {
            if (!gender) return acc;
            acc[gender] = count;
            return acc;
          },
          {} as Record<string, number>,
        ),
      );
  } catch (err) {
    console.error(err);
    return {} as Record<string, number>;
  }
}

export async function getIsTeamAdmin(stateId: string, personId: string) {
  cacheLife("hours");
  cacheTag(`team-admin-${stateId}-${personId}`);

  try {
    const admin = await db
      .select({
        id: person.wcaId,
      })
      .from(person)
      .leftJoin(teamMember, eq(person.wcaId, teamMember.personId))
      .where(
        and(
          eq(person.stateId, stateId),
          eq(teamMember.isAdmin, true),
          eq(person.wcaId, personId),
        ),
      );

    return admin.length > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}
