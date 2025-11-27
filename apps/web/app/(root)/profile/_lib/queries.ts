"use cache";

import "server-only";
import { db } from "@/db";
import { person } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getProfile(userId: string) {
  cacheLife("max");
  cacheTag(`profile-person-${userId}`);

  try {
    const persons = await db
      .select({
        id: person.id,
        name: person.name,
        gender: person.gender,
        stateId: person.stateId,
      })
      .from(person)
      .where(eq(person.id, userId));

    return persons.length > 0 ? persons[0] : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
