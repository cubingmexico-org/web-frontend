import { NextResponse } from "next/server";
import { db } from "@/db";
import { and, asc, eq, ne, notInArray } from "drizzle-orm";
import { person, rankAverage, event, rankSingle, state } from "@/db/schema";
import { EXCLUDED_EVENTS } from "@/lib/constants";

export async function POST(): Promise<NextResponse> {
  try {
    const states = await db.select().from(state);
    const events = await db
      .select()
      .from(event)
      .where(notInArray(event.id, EXCLUDED_EVENTS));

    await db.update(rankSingle).set({ stateRank: null });
    await db.update(rankAverage).set({ stateRank: null });

    const singleUpdates: {
      personId: string;
      eventId: string;
      stateRank: number;
    }[] = [];
    const averageUpdates: {
      personId: string;
      eventId: string;
      stateRank: number;
    }[] = [];

    for (const s of states) {
      for (const e of events) {
        const singleWhere = and(
          ne(rankSingle.countryRank, 0),
          eq(rankSingle.eventId, e.id),
          eq(state.name, s.name),
        );

        const singleData = await db
          .select({
            personId: rankSingle.personId,
            eventId: rankSingle.eventId,
          })
          .from(rankSingle)
          .innerJoin(person, eq(rankSingle.personId, person.id))
          .leftJoin(state, eq(person.stateId, state.id))
          .where(singleWhere)
          .orderBy(asc(rankSingle.countryRank));

        let singleStateRank = 1;
        for (const record of singleData) {
          singleUpdates.push({
            personId: record.personId,
            eventId: record.eventId,
            stateRank: singleStateRank,
          });
          singleStateRank++;
        }

        const averageWhere = and(
          ne(rankAverage.countryRank, 0),
          eq(rankAverage.eventId, e.id),
          eq(state.name, s.name),
        );

        const averageData = await db
          .select({
            personId: rankAverage.personId,
            eventId: rankAverage.eventId,
          })
          .from(rankAverage)
          .innerJoin(person, eq(rankAverage.personId, person.id))
          .leftJoin(state, eq(person.stateId, state.id))
          .where(averageWhere)
          .orderBy(asc(rankAverage.countryRank));

        let averageStateRank = 1;
        for (const record of averageData) {
          averageUpdates.push({
            personId: record.personId,
            eventId: record.eventId,
            stateRank: averageStateRank,
          });
          averageStateRank++;
        }
      }
    }

    await db.transaction(async (tx) => {
      for (const update of singleUpdates) {
        await tx
          .update(rankSingle)
          .set({ stateRank: update.stateRank })
          .where(
            and(
              eq(rankSingle.personId, update.personId),
              eq(rankSingle.eventId, update.eventId),
            ),
          );
      }

      for (const update of averageUpdates) {
        await tx
          .update(rankAverage)
          .set({ stateRank: update.stateRank })
          .where(
            and(
              eq(rankAverage.personId, update.personId),
              eq(rankAverage.eventId, update.eventId),
            ),
          );
      }
    });

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
