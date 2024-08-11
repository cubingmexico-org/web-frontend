/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { insertCompetitions, insertNewScores } from "@/app/lib/data";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // eslint-disable-next-line no-console -- Logging
  console.log("Inserting competitions and new scores");

  await insertCompetitions();
  await insertNewScores();
  return NextResponse.json({ success: true });
}
