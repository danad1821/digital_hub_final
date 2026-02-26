import pool from '@/app/_lib/db';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch metadata from MySQL
    const [rows]: any = await pool.query(
      "SELECT filename, content_type FROM schedules WHERE id = ?", 
      [id]
    );

    if (!rows.length) {
      return new NextResponse('File record not found', { status: 404 });
    }

    const { filename, content_type } = rows[0];

    // 2. Define the absolute path to the file on the server
    // Assuming files are stored in a folder named 'uploads' at the project root
    const filePath = path.join(process.cwd(), 'uploads', filename);

    // 3. Check if file exists on disk
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('Physical file not found on server', { status: 404 });
    }

    // 4. Read the file as a buffer
    const fileBuffer = await fs.readFile(filePath);

    // 5. Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': content_type || 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error('API Error:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}