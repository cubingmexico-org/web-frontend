import { NextResponse } from "next/server";
import { getPersonsWithoutState } from "@/db/queries";

const isProduction = process.env.NODE_ENV === "production";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    if (isProduction) {
      return NextResponse.json(
        { success: false, message: "Not runnable in production" },
        { status: 403 },
      );
    }

    const search = new URL(request.url).searchParams.get("search") || "";

    const results = await getPersonsWithoutState({
      search: search || "",
    });

    return NextResponse.json({
      success: true,
      data: results,
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
