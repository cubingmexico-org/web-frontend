import { buttonVariants } from "@workspace/ui/components/button";
import { Teams } from "./_components/teams";
import { db } from "@/db";
import { person, state, team } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";

export default async function Page() {
  const data = await db
    .select({
      id: team.stateId,
      name: team.name,
      description: team.description,
      image: team.image,
      coverImage: team.coverImage,
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
      team.coverImage,
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
          <Link
            href="https://www.facebook.com/cubingmexico"
            target="_blank"
            className={buttonVariants({ variant: "default" })}
          >
            Contáctate
          </Link>
        </div>
      </div>
    </main>
  );
}
