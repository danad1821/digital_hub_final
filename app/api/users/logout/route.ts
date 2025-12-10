// /app/api/logout/route.ts or similar
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // 1. Delete the user-role cookie
    const cookiesData = await cookies();
    cookiesData.delete("user-role");

    // 2. Return a success response
    return NextResponse.json(
      { message: "Logout successful." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout API Error:", error);

    // Return a generic error response
    return NextResponse.json(
      { error: "An internal server error occurred during logout." },
      { status: 500 }
    );
  }
}

