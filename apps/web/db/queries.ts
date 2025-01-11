import "server-only";
import { db } from "@/db";
import { event, type Event } from "@/db/schema";
import { unstable_cache } from "@/lib/unstable-cache";
import { sql } from "drizzle-orm";

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
          .where(sql`${event.rank} < 200`)
          .orderBy(event.rank)
          .then((res) => res);
      } catch (err) {
        console.error(err);
        return [] as Event[];
      }
    },
    ["events"],
    {
      revalidate: 3600,
    },
  )();
}
