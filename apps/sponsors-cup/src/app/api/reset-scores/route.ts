import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resetScores } from "@/app/actions";

export async function GET(request: NextRequest): Promise<Response> {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const competitionId = url.searchParams.get("competition_id");
  if (!competitionId) {
    return new Response("Bad Request: Missing competition_id parameter", {
      status: 400,
    });
  }

  await resetScores(competitionId);
  return NextResponse.json({ success: true });
}
