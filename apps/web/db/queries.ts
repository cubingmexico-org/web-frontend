import "server-only";
import { db } from "@/db";
import { event, State, state, Team, team } from "@/db/schema";
import { unstable_cache } from "@/lib/unstable-cache";
import { eq, lt } from "drizzle-orm";

export async function getEvents() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            id: event.id,
            name: event.name,
          })
          .from(event)
          .where(lt(event.rank, 200))
          .orderBy(event.rank)
          .then((res) => res);
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    ["events"],
    {
      revalidate: false,
    },
  )();
}

export async function getStates() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            id: state.id,
            name: state.name,
          })
          .from(state)
          .then((res) => res);
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    ["states"],
    {
      revalidate: 3600,
    },
  )();
}

export async function saveTeam({
  stateId,
  name,
  description,
  socialLinks,
}: {
  stateId: State["id"];
  name: Team["name"];
  description: Team["description"];
  socialLinks: Team["socialLinks"];
}) {
  try {
    return await db
      .update(team)
      .set({
        name,
        description,
        socialLinks,
      })
      .where(eq(team.stateId, stateId));
  } catch (error) {
    console.error("Failed to save team in database");
    throw error;
  }
}
