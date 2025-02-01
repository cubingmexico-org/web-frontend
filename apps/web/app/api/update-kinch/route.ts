import { NextResponse } from "next/server";
import { db } from "@/db";
import { and, eq, min, ne, notInArray, or, sql } from "drizzle-orm";
import { person, rankSingle, state } from "@/db/schema";
import { EXCLUDED_EVENTS } from "@/lib/constants";

export async function POST(): Promise<NextResponse> {
  const input = {
    state: "Nayarit",
    gender: undefined,
  }

  try {
    const subquerySingleWhere = await db
          .select({
            eventId: rankSingle.eventId,
            countryRank: min(rankSingle.countryRank),
          })
          .from(rankSingle)
          .innerJoin(person, eq(rankSingle.personId, person.id))
          .leftJoin(state, eq(person.stateId, state.id))
          .where(
            and(
              ne(rankSingle.countryRank, 0),
              input.state ? eq(state.name, input.state) : undefined,
              input.gender ? eq(person.gender, input.gender) : undefined,
              notInArray(rankSingle.eventId, EXCLUDED_EVENTS),
            ),
          )
          .groupBy(rankSingle.eventId);

    const singleWhere = and(
      subquerySingleWhere.length > 0
        ? or(
            ...subquerySingleWhere.map(
              (row) =>
                sql`${rankSingle.eventId} = ${row.eventId} AND ${rankSingle.countryRank} = ${row.countryRank}`,
            ),
          )
        : undefined,
      input.state ? eq(state.name, input.state) : undefined,
      input.gender ? eq(person.gender, input.gender) : undefined,
      notInArray(rankSingle.eventId, EXCLUDED_EVENTS),
    );

    const singleRecords = await db
            .select({
              best: rankSingle.best,
              eventId: rankSingle.eventId,
            })
            .from(rankSingle)
            .innerJoin(person, eq(rankSingle.personId, person.id))
            .leftJoin(state, eq(person.stateId, state.id))
            .where(singleWhere)

      console.log(singleRecords);

    return NextResponse.json({
      success: true,
      message: "Database updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error updating database" },
      { status: 500 },
    );
  }
}
