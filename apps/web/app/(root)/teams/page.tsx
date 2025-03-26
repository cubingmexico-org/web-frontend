import { Button } from "@workspace/ui/components/button";
import { Teams } from "./_components/teams";
import { db } from "@/db";
import { person, state, team } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export default async function Page() {
  const data = await db
    .select({
      id: team.stateId,
      name: team.name,
      description: team.description,
      image: team.image,
      state: state.name,
      founded: team.founded,
      isActive: team.isActive,
      members: count(person.id),
    })
    .from(team)
    .innerJoin(state, eq(team.stateId, state.id))
    .innerJoin(person, eq(team.stateId, person.stateId))
    .groupBy(
      team.stateId,
      team.name,
      team.description,
      team.image,
      state.name,
      team.founded,
      team.isActive,
    )
    .orderBy(desc(count(person.id)));

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <Teams teams={data} />

      <div className="mt-12 bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Comienza tu propio Team</h2>
        <p className="mb-4">
          ¿No encuentras tu Team en la lista? ¡Registra uno nuevo y comienza a
          conectar con otros speedcubers en tu estado!
        </p>
        <div className="flex gap-4">
          <Button>Contáctate con nosotros para registrar un nuevo Team</Button>
        </div>
      </div>
    </main>
  );
}
