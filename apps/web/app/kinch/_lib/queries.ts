import "server-only";
import { db } from "@/db";
import { state, person, kinchRanks } from "@/db/schema";
import { and, count, ilike, eq, desc, asc, inArray } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";
import { type GetKinchSinglesSchema } from "./validations";

export async function getKinch(input: GetKinchSinglesSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where = and(
          input.name ? ilike(person.name, `%${input.name}%`) : undefined,
          input.state.length > 0 ? inArray(state.name, input.state) : undefined,
          input.gender.length > 0
            ? inArray(person.gender, input.gender)
            : undefined,
        );

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) =>
                item.desc
                  ? desc(kinchRanks[item.id])
                  : asc(kinchRanks[item.id]),
              )
            : [asc(kinchRanks.overall)];

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              rank: kinchRanks.rank,
              personId: kinchRanks.personId,
              name: person.name,
              overall: kinchRanks.overall,
              events: kinchRanks.events,
              state: state.name,
              gender: person.gender,
            })
            .from(kinchRanks)
            .innerJoin(person, eq(kinchRanks.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = (await tx
            .select({
              count: count(),
            })
            .from(kinchRanks)
            .innerJoin(person, eq(kinchRanks.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
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
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["sor"],
    },
  )();
}
