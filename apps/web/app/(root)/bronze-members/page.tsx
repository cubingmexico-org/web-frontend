import { db } from "@/db";
import { getEvents } from "@/db/queries";
import { person, result, state } from "@/db/schema";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { eq, gt, and, inArray, countDistinct } from "drizzle-orm";

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

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Miembros Bronce de la WCA</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((person) => (
          <Card key={person.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={person.id} alt={person.name ?? undefined} />
                <AvatarFallback>
                  {person.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{person.name}</CardTitle>
                <CardDescription>
                  {person.id} - {person.state}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
