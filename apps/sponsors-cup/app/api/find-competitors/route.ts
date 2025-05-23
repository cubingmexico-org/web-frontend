import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { findCompetitors } from "@/app/actions";

export async function GET(request: NextRequest): Promise<Response> {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const competitionId = url.searchParams.get("competitionId");
  if (!competitionId) {
    return new Response("Bad Request: Missing competitionId parameter", {
      status: 400,
    });
  }

  const competitors = await findCompetitors(competitionId);
  return NextResponse.json({ competitors });
}
