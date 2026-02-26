import pool from "@/app/_lib/db"; //
import { NextResponse } from "next/server";

// ---------------------------
// 📝 PUT (MARK AS READ)
// ---------------------------
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isRead } = await request.json();

    const [result]: any = await pool.query(
      "UPDATE messages SET is_read = ? WHERE id = ?",
      [isRead ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated" }, { status: 200 });

  } catch (error) {
    console.error("Error updating Message:", error);
    return NextResponse.json({ error: "Failed to update Message" }, { status: 500 });
  }
}

// ---------------------------
// 🗑️ DELETE (REMOVE MESSAGE)
// ---------------------------
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [result]: any = await pool.query("DELETE FROM messages WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting Message:", error);
    return NextResponse.json({ error: "Failed to delete Message" }, { status: 500 });
  }
}