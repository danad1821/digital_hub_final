import pool from "@/app/_lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch the image record from MySQL
    const [rows]: any = await pool.query(
      "SELECT title, image_url FROM gallery_images WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Image record not found" }, { status: 404 });
    }

    // 2. Return the metadata including the URL
    // The frontend can then use <img src={data.image_url} />
    return NextResponse.json(rows[0], { status: 200 });

  } catch (error: any) {
    console.error("Gallery Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}