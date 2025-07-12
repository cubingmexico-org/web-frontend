import "server-only";
import { db } from "@/db";
import { Person, person, result, teamMember } from "@/db/schema";
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
} from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { type GetMembersSchema } from "./validations";

export async function getMembers(
  input: GetMembersSchema,
  stateId: Person["stateId"],
) {
  return await unstable_cache(
    async () => {
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
                      ? desc(sql`"stateRecords"`)
                      : asc(sql`"stateRecords"`);
                  case "podiums":
                    return item.desc
                      ? desc(sql`"podiums"`)
                      : asc(sql`"podiums"`);
                  case "specialties": // TODO: Fix this
                    return item.desc
                      ? desc(teamMember.specialties)
                      : asc(teamMember.specialties);
                  default:
                    return item.desc
                      ? desc(person[item.id])
                      : asc(person[item.id]);
                }
              })
            : [asc(person.name)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              id: person.id,
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
                    FROM "ranksSingle"
                    WHERE "personId" = ${person.id}
                    AND "stateRank" = 1)
                  +
                  (SELECT COUNT(*)
                    FROM "ranksAverage"
                    WHERE "personId" = ${person.id}
                    AND "stateRank" = 1)
                ) AS INTEGER) AS stateRecords
              )`.as("stateRecords"),
              specialties: teamMember.specialties,
            })
            .from(person)
            .leftJoin(teamMember, eq(person.id, teamMember.personId))
            .innerJoin(result, eq(person.id, result.personId))
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .groupBy(
              person.id,
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
            .leftJoin(teamMember, eq(person.id, teamMember.personId))
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
    },
    [JSON.stringify(input), stateId!],
    {
      revalidate: 3600,
      tags: ["members"],
    },
  )();
}

export async function getMembersGenderCounts(stateId: Person["stateId"]) {
  return unstable_cache(
    async () => {
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
    },
    [stateId!],
    {
      revalidate: 3600,
      tags: ["members-gender-count"],
    },
  )();
}
