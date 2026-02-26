import pool from "@/app/_lib/db";
import { NextResponse } from "next/server";

// === GET Handler: Fetch All Services ===
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM services ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET Services Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch services.", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// === POST Handler: Create a New Service ===
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { serviceName, summary } = data;

    if (!serviceName || !summary) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const [result]: any = await pool.query(
      "INSERT INTO services (service_name, summary) VALUES (?, ?)",
      [serviceName, summary]
    );

    return NextResponse.json(
      { id: result.insertId, service_name: serviceName, summary },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Service Error:", error);

    // MySQL Duplicate Entry Error (ER_DUP_ENTRY)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: `Service with name already exists.` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create new service.", error: error.message },
      { status: 500 }
    );
  }
}