"use cache";

import "server-only";
import { db } from "@/db";
import {
  state,
  person,
  type State,
  organiser,
  competitionOrganiser,
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
import { type GetOrganisersSchema } from "./validations";
import { cacheLife, cacheTag } from "next/cache";

export async function getOrganisers(input: GetOrganisersSchema) {
  cacheLife("hours");
  cacheTag("organisers");

  try {
    const offset = (input.page - 1) * input.perPage;

    const where = and(
      input.name ? ilike(person.name, `%${input.name}%`) : undefined,
      input.state.length > 0 ? inArray(state.name, input.state) : undefined,
      input.status.length > 0
        ? inArray(organiser.status, input.status)
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
                  ? desc(countDistinct(competitionOrganiser.competitionId))
                  : asc(countDistinct(competitionOrganiser.competitionId));
              case "status":
                return item.desc
                  ? desc(organiser.status)
                  : asc(organiser.status);
              default:
                return item.desc ? desc(person[item.id]) : asc(person[item.id]);
            }
          })
        : [asc(person.name)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: person.id,
          name: person.name,
          gender: person.gender,
          state: state.name,
          status: organiser.status,
          competitions: countDistinct(competitionOrganiser.competitionId),
        })
        .from(organiser)
        .innerJoin(
          competitionOrganiser,
          eq(organiser.id, competitionOrganiser.organiserId),
        )
        .innerJoin(person, eq(organiser.personId, person.id))
        .leftJoin(state, eq(person.stateId, state.id))
        .limit(input.perPage)
        .offset(offset)
        .where(where)
        .groupBy(person.id, state.name, organiser.status)
        .orderBy(...orderBy);

      const total = (await tx
        .select({
          count: count(),
        })
        .from(organiser)
        .innerJoin(
          competitionOrganiser,
          eq(organiser.id, competitionOrganiser.organiserId),
        )
        .innerJoin(person, eq(organiser.personId, person.id))
        .leftJoin(state, eq(person.stateId, state.id))
        .where(where)
        .groupBy(person.id, state.name, organiser.status)
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

export async function getOrganisersStateCounts() {
  cacheLife("hours");
  cacheTag("organisers-state-counts");

  try {
    return await db
      .select({
        state: state.name,
        count: count(),
      })
      .from(organiser)
      .innerJoin(person, eq(organiser.personId, person.id))
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

export async function getOrganisersGenderCounts() {
  cacheLife("hours");
  cacheTag("organisers-gender-counts");

  try {
    return await db
      .select({
        gender: person.gender,
        count: count(),
      })
      .from(organiser)
      .innerJoin(person, eq(organiser.personId, person.id))
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

export async function getOrganiserStatusCounts() {
  cacheLife("hours");
  cacheTag("organisers-status-counts");

  try {
    return await db
      .select({
        status: organiser.status,
        count: count(),
      })
      .from(organiser)
      .groupBy(organiser.status)
      .having(gt(count(), 0))
      .orderBy(organiser.status)
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
