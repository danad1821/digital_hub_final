import pool from '@/app/_lib/db';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.query(
      "SELECT filename, file_url FROM schedules WHERE id = ?", 
      [id]
    );

    if (!rows || rows.length === 0) {
      return new NextResponse('Database record missing', { status: 404 });
    }

    const { filename, file_url } = rows[0];

    // 🌟 THE CRITICAL FIX:
    // Ensure 'uploads' and 'schedules' match your ACTUAL folder structure.
    // If you saved the file to root/uploads/filename, remove 'schedules'.
    const absolutePath = path.join(process.cwd(), "public", file_url);

    console.log("Checking path:", absolutePath); // Check your terminal to see where it's looking

    try {
      await fs.access(absolutePath);
    } catch (err) {
      // This is where it's failing
      return new NextResponse(`Disk Error: Cannot find ${filename} at ${absolutePath}`, { status: 404 });
    }

    const fileBuffer = await fs.readFile(absolutePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      },
    });
  } catch (e) {
    return new NextResponse('Server Error', { status: 500 });
  }
}