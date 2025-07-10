import "server-only";
import { db } from "@/db";
import {
  event,
  Person,
  State,
  state,
  Team,
  team,
  teamMember,
  person,
  TeamMember,
} from "@/db/schema";
import { unstable_cache } from "@/lib/unstable-cache";
import { eq, lt } from "drizzle-orm";
import { cache } from "react";

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
    [],
    {
      revalidate: false,
      tags: ["events"],
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
    [],
    {
      revalidate: false,
      tags: ["states"],
    },
  )();
}

export async function getPersons() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            id: person.id,
            name: person.name,
          })
          .from(person)
          .then((res) => res);
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [],
    {
      revalidate: false,
      tags: ["persons"],
    },
  )();
}

export async function getCurrentUserTeam({ userId }: { userId: Person["id"] }) {
  return await unstable_cache(
    async () => {
      try {
        return (await db
          .select({
            id: person.stateId,
            name: team.name,
          })
          .from(person)
          .innerJoin(team, eq(person.stateId, team.stateId))
          .where(eq(person.id, userId))
          .then((res) => res[0])) as {
          id: string;
          name: string;
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [userId],
    {
      revalidate: 3600,
      tags: ["current-user-team"],
    },
  )();
}

export const getPerson = cache(async (id: string) => {
  const res = await db
    .select({
      name: person.name,
    })
    .from(person)
    .where(eq(person.id, id));
  return res[0];
});

export const getTeam = cache(async (stateId: string) => {
  const res = await db
    .select({
      name: team.name,
      state: state.name,
    })
    .from(team)
    .innerJoin(state, eq(team.stateId, state.id))
    .where(eq(team.stateId, stateId));
  return res[0];
});

export async function saveTeam({
  stateId,
  name,
  description,
  socialLinks,
  founded,
  isActive,
}: {
  stateId: State["id"];
  name: Team["name"];
  description: Team["description"];
  socialLinks: Team["socialLinks"];
  founded: Team["founded"];
  isActive: Team["isActive"];
}) {
  try {
    return await db
      .update(team)
      .set({
        name,
        description,
        socialLinks,
        founded,
        isActive,
      })
      .where(eq(team.stateId, stateId));
  } catch (error) {
    console.error("Failed to save team in database");
    throw error;
  }
}

export async function saveProfile({
  stateId,
  personId,
}: {
  stateId: State["id"];
  personId: Person["id"];
}) {
  try {
    return await db
      .update(person)
      .set({
        stateId,
      })
      .where(eq(person.id, personId));
  } catch (error) {
    console.error("Failed to save profile in database");
    throw error;
  }
}

export async function deleteTeamLogo({ stateId }: { stateId: State["id"] }) {
  try {
    return await db
      .update(team)
      .set({
        image: null,
      })
      .where(eq(team.stateId, stateId));
  } catch (error) {
    console.error("Failed to delete team logo in database");
    throw error;
  }
}

export async function updateTeamLogo({
  stateId,
  image,
}: {
  stateId: State["id"];
  image: Team["image"];
}) {
  try {
    return await db
      .update(team)
      .set({
        image,
      })
      .where(eq(team.stateId, stateId));
  } catch (error) {
    console.error("Failed to update team logo in database");
    throw error;
  }
}

export async function deleteTeamCover({ stateId }: { stateId: State["id"] }) {
  try {
    return await db
      .update(team)
      .set({
        coverImage: null,
      })
      .where(eq(team.stateId, stateId));
  } catch (error) {
    console.error("Failed to delete team cover in database");
    throw error;
  }
}

export async function updateTeamCover({
  stateId,
  coverImage,
}: {
  stateId: State["id"];
  coverImage: Team["coverImage"];
}) {
  try {
    return await db
      .update(team)
      .set({
        coverImage,
      })
      .where(eq(team.stateId, stateId));
  } catch (error) {
    console.error("Failed to update team cover in database");
    throw error;
  }
}

export async function addMember({
  personId,
  stateId,
  specialties,
  achievements,
}: {
  stateId: State["id"];
  personId: Person["id"];
  specialties: TeamMember["specialties"];
  achievements: TeamMember["achievements"];
}) {
  try {
    await db
      .update(person)
      .set({
        stateId,
      })
      .where(eq(person.id, personId));

    await db
      .insert(teamMember)
      .values({
        personId,
        specialties,
        achievements,
      })
      .onConflictDoUpdate({
        target: [teamMember.personId],
        set: {
          specialties,
          achievements,
        },
      });
  } catch (error) {
    console.error("Failed to add member in database");
    throw error;
  }
}
