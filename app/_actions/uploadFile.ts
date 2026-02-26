'use server'

import pool from '../_lib/db'; //
import { saveLocalFile, deleteLocalFile } from '../_lib/file-helper';
import { revalidatePath } from 'next/cache';

export interface UploadResult {
  success: boolean;
  fileId?: string; // We use the MySQL ID as a string for compatibility
  error?: string;
}

export interface ScheduleMetadata {
  id: string;
  filename: string;
  uploadDate: Date;
  contentType: string;
  fileUrl: string; // New field for direct access
}

/**
 * Uploads a file to local storage and updates the MySQL schedules table.
 * Replaces any existing schedule (Singleton behavior).
 */
export async function uploadSchedule(formData: FormData): Promise<UploadResult> {
  try {
    const fileEntry = formData.get('image');
    if (!fileEntry || !(fileEntry instanceof File)) {
      return { success: false, error: 'No valid file uploaded' };
    }

    // 1. Fetch old schedule to clean up physical file
    const [oldRows]: any = await pool.query("SELECT file_url FROM schedules LIMIT 1");
    
    // 2. Save new file to /public/uploads/schedules/
    const newFileUrl = await saveLocalFile(fileEntry, 'schedules');

    // 3. Update Database (Delete old entries to maintain singleton)
    await pool.query("DELETE FROM schedules"); 
    const [result]: any = await pool.query(
      "INSERT INTO schedules (filename, file_url, content_type) VALUES (?, ?, ?)",
      [fileEntry.name, newFileUrl, fileEntry.type || 'application/pdf']
    );

    // 4. Cleanup old physical file
    if (oldRows.length > 0) {
      await deleteLocalFile(oldRows[0].file_url);
    }

    revalidatePath('/schedule');
    return { success: true, fileId: result.insertId.toString() };

  } catch (error: any) {
    console.error(`[Schedule Upload] Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes the current schedule from DB and Disk.
 */
export async function deleteSchedule(): Promise<{ success: boolean; error?: string }> {
  try {
    const [rows]: any = await pool.query("SELECT file_url FROM schedules LIMIT 1");
    
    if (rows.length > 0) {
      await deleteLocalFile(rows[0].file_url);
      await pool.query("DELETE FROM schedules");
    }

    revalidatePath('/schedule');
    return { success: true };
  } catch (error: any) {
    console.error("[Schedule Delete] Error:", error);
    return { success: false, error: 'Failed to delete schedule.' };
  }
}

/**
 * Fetches current metadata.
 */
export async function getCurrentSchedule(): Promise<ScheduleMetadata | null> {
  try {
    const [rows]: any = await pool.query("SELECT * FROM schedules ORDER BY upload_date DESC LIMIT 1");

    if (rows.length === 0) return null;

    const s = rows[0];
    return {
      id: s.id.toString(),
      filename: s.filename,
      uploadDate: s.upload_date,
      contentType: s.content_type,
      fileUrl: s.file_url
    };
  } catch (error) {
    console.error("[Schedule Fetch] Error:", error);
    return null;
  }
}