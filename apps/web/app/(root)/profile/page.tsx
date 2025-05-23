/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { auth } from "@/auth";
import { db } from "@/db";
import { person } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Profile } from "./_components/profile";
import { getPerson, getStates } from "@/db/queries";
import { unstable_cache } from "@/lib/unstable-cache";
import { UnauthorizedView } from "@/components/unauthorized-view";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  const person = await getPerson(session?.user?.id!);

  return {
    title: `${person?.name} | Cubing México`,
    description: `Perfil de ${person?.name}`,
  };
}

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return <UnauthorizedView />;
  }

  const persons = await unstable_cache(
    async () => {
      return await db
        .select({
          id: person.id,
          name: person.name,
          gender: person.gender,
          stateId: person.stateId,
        })
        .from(person)
        .where(eq(person.id, session?.user?.id!));
    },
    [session?.user?.id!],
    { revalidate: 3600, tags: ["profile-person"] },
  )();

  const states = await getStates();

  return <Profile user={session?.user!} person={persons[0]!} states={states} />;
}
