"use cache";

import "server-only";
import { db } from "@/db";
import { team, state, person } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getTeams() {
  cacheLife("hours");
  cacheTag("teams-data");

  try {
    return await db
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
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}
