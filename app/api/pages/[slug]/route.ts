import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/_lib/db"; //

/**
 * @method GET
 * @description Fetches a page document by its slug from MySQL.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const [rows]: any = await pool.query("SELECT * FROM pages WHERE slug = ?", [slug]);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    // MySQL returns the JSON column as a parsed object/array automatically
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error: any) {
    console.error("MySQL GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message, path: slug },
      { status: 500 },
    );
  }
}

/**
 * @method PUT
 * @description Updates an existing page document by its slug in MySQL.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { success: false, error: "Missing page slug" },
      { status: 400 },
    );
  }

  try {
    const pageData = await request.json();

    // Update the record. Using JSON.stringify ensures the array is correctly formatted for the JSON column.
    const [result]: any = await pool.query(
      `UPDATE pages SET 
        sections = ?, 
        page_title = ?, 
        updated_at = NOW() 
       WHERE slug = ?`,
      [JSON.stringify(pageData.sections), pageData.page_title, slug]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: `Page with slug '${slug}' not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Page updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating page content:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Failed to update page content.",
      },
      { status: 500 },
    );
  }
}