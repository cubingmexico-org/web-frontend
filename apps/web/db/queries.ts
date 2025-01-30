import "server-only";
import { db } from "@/db";
import { event, state } from "@/db/schema";
import { unstable_cache } from "@/lib/unstable-cache";
import { lt } from "drizzle-orm";

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
      revalidate: 3600,
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
