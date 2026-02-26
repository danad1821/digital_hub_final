import pool from "@/app/_lib/db"; //
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Select all pages from the MySQL table
    const [rows] = await pool.query("SELECT * FROM pages ORDER BY created_at DESC");
    
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET pages Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch pages.", error: (error as Error).message },
      { status: 500 }
    );
  }
}