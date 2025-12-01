import { NextResponse } from "next/server";
import { getPersonsWithoutState } from "@/db/queries";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const search = new URL(request.url).searchParams.get("search") || "";

    const results = await getPersonsWithoutState({
      search: search || "",
    });

    return NextResponse.json({
      success: true,
      data: results,
      message: "Persons without state retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error retrieving persons" },
      { status: 500 },
    );
  }
}
