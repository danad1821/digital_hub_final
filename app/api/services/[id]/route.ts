import { NextResponse } from "next/server";
import pool from "@/app/_lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { serviceName, summary } = data;

    // 1. Perform the Update
    const [updateResult]: any = await pool.query(
      `UPDATE services SET 
        service_name = COALESCE(?, service_name), 
        summary = COALESCE(?, summary),
        updated_at = NOW()
       WHERE id = ?`,
      [serviceName, summary, id]
    );

    // 2. Check if the row existed
    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // 3. Fetch the newly updated data from the database
    const [rows]: any = await pool.query(
      "SELECT id, service_name, summary, updated_at as updatedAt FROM services WHERE id = ?",
      [id]
    );

    // 4. Return the first (and only) row
    return NextResponse.json(rows[0], { status: 200 });

  } catch (error: any) {
    console.error("Error updating Service:", error);
    return NextResponse.json(
      { message: "Failed to update service.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [result]: any = await pool.query("DELETE FROM services WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting Service:", error);
    return NextResponse.json(
      { error: "Failed to delete Service", details: error.message },
      { status: 500 }
    );
  }
}