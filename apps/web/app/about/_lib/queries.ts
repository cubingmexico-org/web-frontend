import "server-only";
import { db } from "@/db";
import { person, competition, result } from "@/db/schema";
import { count, lt, eq, and, countDistinct } from "drizzle-orm";
import { unstable_cache } from "@/lib/unstable-cache";

export async function getPersons() {
  return unstable_cache(
    async () => {
      try {
        const total = (await db
          .select({
            count: countDistinct(person.id),
          })
          .from(person)
          .innerJoin(result, and(eq(person.id, result.personId)))
          .innerJoin(competition, and(eq(competition.id, result.competitionId)))
          .where(and(eq(competition.countryId, "Mexico")))
          .execute()
          .then((res) => res[0]?.count ?? 0)) as number;

        return total;
      } catch (err) {
        console.error(err);
        return 0;
      }
    },
    ["number-of-persons"],
    {
      revalidate: 3600,
    },
  )();
}

export async function getCompetitions() {
  return unstable_cache(
    async () => {
      try {
        const total = (await db
          .select({
            count: count(),
          })
          .from(competition)
          .where(
            and(
              eq(competition.countryId, "Mexico"),
              lt(competition.endDate, new Date()),
            ),
          )
          .execute()
          .then((res) => res[0]?.count ?? 0)) as number;

        return total;
      } catch (err) {
        console.error(err);
        return 0;
      }
    },
    ["number-of-competitions"],
    {
      revalidate: 3600,
    },
  )();
}
