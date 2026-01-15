"use cache";

import "server-only";
import { db } from "@/db";
import {
  state,
  person,
  type State,
  organizer,
  competitionOrganizer,
} from "@/db/schema";
import {
  and,
  count,
  ilike,
  gt,
  eq,
  desc,
  asc,
  inArray,
  countDistinct,
} from "drizzle-orm";
import { type GetOrganizersSchema } from "./validations";
import { cacheLife, cacheTag } from "next/cache";

export async function getOrganizers(input: GetOrganizersSchema) {
  cacheLife("hours");
  cacheTag("organizers");

  try {
    const offset = (input.page - 1) * input.perPage;

    const where = and(
      input.name ? ilike(person.name, `%${input.name}%`) : undefined,
      input.state.length > 0 ? inArray(state.name, input.state) : undefined,
      input.status.length > 0
        ? inArray(organizer.status, input.status)
        : undefined,
      input.gender.length > 0
        ? inArray(person.gender, input.gender)
        : undefined,
    );

    const orderBy =
      input.sort.length > 0
        ? input.sort.map((item) => {
            switch (item.id) {
              case "state":
                return item.desc ? desc(state.name) : asc(state.name);
              case "competitions":
                return item.desc
                  ? desc(countDistinct(competitionOrganizer.competitionId))
                  : asc(countDistinct(competitionOrganizer.competitionId));
              case "status":
                return item.desc
                  ? desc(organizer.status)
                  : asc(organizer.status);
              default:
                return item.desc ? desc(person[item.id]) : asc(person[item.id]);
            }
          })
        : [asc(person.name)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          wcaId: person.wcaId,
          name: person.name,
          gender: person.gender,
          state: state.name,
          status: organizer.status,
          competitions: countDistinct(competitionOrganizer.competitionId),
        })
        .from(organizer)
        .innerJoin(
          competitionOrganizer,
          eq(organizer.id, competitionOrganizer.organizerId),
        )
        .innerJoin(person, eq(organizer.personId, person.wcaId))
        .leftJoin(state, eq(person.stateId, state.id))
        .limit(input.perPage)
        .offset(offset)
        .where(where)
        .groupBy(person.wcaId, state.name, organizer.status)
        .orderBy(...orderBy);

      const total = (await tx
        .select({
          count: count(),
        })
        .from(organizer)
        .innerJoin(
          competitionOrganizer,
          eq(organizer.id, competitionOrganizer.organizerId),
        )
        .innerJoin(person, eq(organizer.personId, person.wcaId))
        .leftJoin(state, eq(person.stateId, state.id))
        .where(where)
        .groupBy(person.wcaId, state.name, organizer.status)
        .execute()
        .then((res) => res.length)) as number;

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / input.perPage);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export async function getOrganizersStateCounts() {
  cacheLife("hours");
  cacheTag("organizers-state-counts");

  try {
    return await db
      .select({
        state: state.name,
        count: count(),
      })
      .from(organizer)
      .innerJoin(person, eq(organizer.personId, person.wcaId))
      .leftJoin(state, eq(person.stateId, state.id))
      .groupBy(state.name)
      .having(gt(count(), 0))
      .orderBy(state.name)
      .then((res) =>
        res.reduce(
          (acc, { state, count }) => {
            if (!state) return acc;
            acc[state] = count;
            return acc;
          },
          {} as Record<State["name"], number>,
        ),
      );
  } catch (err) {
    console.error(err);
    return {} as Record<State["name"], number>;
  }
}

export async function getOrganizersGenderCounts() {
  cacheLife("hours");
  cacheTag("organizers-gender-counts");

  try {
    return await db
      .select({
        gender: person.gender,
        count: count(),
      })
      .from(organizer)
      .innerJoin(person, eq(organizer.personId, person.wcaId))
      .groupBy(person.gender)
      .having(gt(count(), 0))
      .orderBy(person.gender)
      .then((res) =>
        res.reduce(
          (acc, { gender, count }) => {
            if (!gender) return acc;
            acc[gender] = count;
            return acc;
          },
          {} as Record<string, number>,
        ),
      );
  } catch (err) {
    console.error(err);
    return {} as Record<string, number>;
  }
}

export async function getOrganizerStatusCounts() {
  cacheLife("hours");
  cacheTag("organizers-status-counts");

  try {
    return await db
      .select({
        status: organizer.status,
        count: count(),
      })
      .from(organizer)
      .groupBy(organizer.status)
      .having(gt(count(), 0))
      .orderBy(organizer.status)
      .then((res) =>
        res.reduce(
          (acc, { status, count }) => {
            if (!status) return acc;
            acc[status] = count;
            return acc;
          },
          {} as Record<string, number>,
        ),
      );
  } catch (err) {
    console.error(err);
    return {} as Record<string, number>;
  }
}
