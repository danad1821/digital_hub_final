import { NextResponse } from "next/server";
import pool from "@/app/_lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { sectionIndex } = await request.json();
    const {slug} = await params;

    // 1. Fetch the current page data
    const [rows]: any = await pool.query(
      "SELECT content FROM pages WHERE slug = ?",
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const pageData = JSON.parse(rows[0].content);

    // 2. Clear the image reference for the specific section
    if (pageData.sections[sectionIndex]) {
      pageData.sections[sectionIndex].image_ref = ""; 
      // Or null, depending on how your frontend handles empty images
    }

    // 3. Update the database
    await pool.query(
      "UPDATE pages SET content = ? WHERE slug = ?",
      [JSON.stringify(pageData), slug]
    );

    return NextResponse.json({ message: "Image reference removed" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}