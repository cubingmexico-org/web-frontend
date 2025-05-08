import { db } from "@/db";
import { getEvents } from "@/db/queries";
import { person, result, state } from "@/db/schema";
import { eq, gt, and, inArray, countDistinct } from "drizzle-orm";
import { Bronze } from "./_components/bronze";

export default async function Page() {
  const events = await getEvents();

  const data = await db
    .select({
      id: person.id,
      name: person.name,
      gender: person.gender,
      state: state.name,
    })
    .from(person)
    .innerJoin(result, eq(person.id, result.personId))
    .leftJoin(state, eq(person.stateId, state.id))
    .where(
      and(
        inArray(
          result.eventId,
          events.map((event) => event.id),
        ),
        gt(result.best, 0),
      ),
    )
    .groupBy(person.id, person.name, person.gender, state.name)
    .having(eq(countDistinct(result.eventId), events.length))
    .orderBy(person.name);

  return <Bronze members={data} />;
}
