/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { auth } from "@/auth";
import { db } from "@/db";
import { person, state } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  const session = await auth();

  const persons = await db
    .select({
      id: person.id,
      name: person.name,
      gender: person.gender,
      state: state.name,
    })
    .from(person)
    .leftJoin(state, eq(person.stateId, state.id))
    .where(eq(person.id, session?.user?.id!));

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1>Perfil</h1>
      <p>Nombre: {persons[0]?.name}</p>
      <p>WCA ID: {persons[0]?.id}</p>
      <p>Estado: {persons[0]?.state}</p>
    </main>
  );
}
