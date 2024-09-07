import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateScores } from "@/app/actions";

export async function GET(request: NextRequest): Promise<Response> {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await updateScores();
  return NextResponse.json({ success: true });
}
