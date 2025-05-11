/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { auth } from "@/auth";
import { db } from "@/db";
import { person, state } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Profile } from "./_components/profile";
import { getStates } from "@/db/queries";
import { unstable_cache } from "@/lib/unstable-cache";

export default async function Page() {
  const session = await auth();

  const persons = await unstable_cache(
    async () => {
      return await db
        .select({
          id: person.id,
          name: person.name,
          gender: person.gender,
          state: state.name,
        })
        .from(person)
        .leftJoin(state, eq(person.stateId, state.id))
        .where(eq(person.id, session?.user?.id!));
    },
    [session?.user?.id!],
    { revalidate: 3600, tags: ["profile-person"] },
  )();

  const states = await getStates();

  return <Profile user={session?.user!} person={persons[0]!} states={states} />;
}
