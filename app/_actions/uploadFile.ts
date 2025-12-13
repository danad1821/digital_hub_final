// /app/_actions/uploadFile.ts (Now dedicated to Schedule actions)

'use server'

import { connectToDatabase } from '../_lib/db'; // Adjust path
import mongoose, { Types } from 'mongoose';
import { Readable } from 'stream';
// IMPORT the new model
import Schedule from '../_models/Schedule';

// --- 1. Types Definitions ---

export interface UploadResult {
  success: boolean;
  fileId?: string;
  error?: string;
}

// Rename FileMetadata to ScheduleMetadata for clarity
export interface ScheduleMetadata {
  id: string; // The MongoDB ID of the file in GridFS (the file pointer)
  filename: string;
  uploadDate: Date;
  contentType: string;
}

// --- 2. GridFS Helper to get the bucket ---
async function getGridFSBucket(db: mongoose.mongo.Db) {
  // IMPORTANT: Keeps the bucketName as 'uploads' so the API route doesn't change.
  return new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'uploads'
  });
}

// --- 3. Primary Upload/Replace Function ---

/**
 * Uploads a file to GridFS and updates the Schedule model. 
 * Automatically deletes the previous schedule file and model entry.
 * @param formData FormData object containing the file under the key 'image'.
 * @param oldFileId The GridFS ID of the file to be replaced and deleted.
 * @returns UploadResult object indicating success or failure.
 */
export async function uploadSchedule(formData: FormData, oldFileId: string | null): Promise<UploadResult> {
  const fileEntry = formData.get('image');
  if (!fileEntry || typeof fileEntry === 'string') {
    return { success: false, error: 'No valid file uploaded' };
  }
  const file = fileEntry as File;

  const connection = await connectToDatabase();
  const db: any = connection.connection.db;
  const bucket = await getGridFSBucket(db);

  // Convert browser stream to Node.js Readable stream for piping
  const nodeReadableStream = Readable.fromWeb(file.stream() as any);
  
  // --- Start Upload Transaction ---
  const uploadPromise: Promise<Types.ObjectId> = new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: { 
        contentType: file.type || 'binary/octet-stream',
      },
    });

    nodeReadableStream
      .pipe(uploadStream)
      .on('finish', () => {
         resolve(uploadStream.id); // Resolves with the GridFS file ID
      })
      .on('error', (error) => {
         console.error("[Schedule Upload] Stream Error during upload:", error);
         reject(error);
      });
  });

  try {
    const newFileId = await uploadPromise; // GridFS upload complete

    // --- 1. Delete Old Schedule and File (if one exists) ---
    if (oldFileId) {
        try {
            await bucket.delete(new Types.ObjectId(oldFileId));
            await Schedule.deleteOne({ fileId: new Types.ObjectId(oldFileId) });
        } catch (cleanupError) {
            console.warn(`[Schedule Upload] Cleanup warning: Failed to delete old file/model entry (${oldFileId}).`, cleanupError);
            // Non-critical cleanup failure, but log it.
        }
    }

    // --- 2. Create New Schedule Entry ---
    const newSchedule = new Schedule({
        fileId: newFileId,
        filename: file.name,
        contentType: file.type || 'application/pdf',
        uploadDate: new Date(),
    });
    // Ensure existing document is removed before saving, for true singleton, 
    // although this model is typically only used to store one pointer at a time.
    await Schedule.deleteMany({});
    await newSchedule.save(); 

    return { success: true, fileId: newFileId.toString() };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    console.error(`[Schedule Upload] Transaction failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

// --- 4. Delete Schedule Function ---

/**
 * Deletes the current schedule file from GridFS and removes the model pointer.
 */
export async function deleteSchedule(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const connection = await connectToDatabase();
    const db: any = connection.connection.db;
    const bucket = await getGridFSBucket(db);

    const objectId = new Types.ObjectId(fileId);
    
    // Delete the file from GridFS
    await bucket.delete(objectId);
    
    // Delete the pointer from the Schedule model
    await Schedule.deleteOne({ fileId: objectId });

    return { success: true };
  } catch (error) {
    console.error("[Schedule Delete] GridFS or Model deletion error:", error);
    return { success: false, error: 'Failed to delete current schedule.' };
  }
}


// --- 5. Fetch Current Schedule Metadata Function ---

/**
 * Fetches the metadata for the current schedule from the dedicated Schedule model.
 * The public interface (return type/path) remains the same to avoid changing the frontend page.tsx.
 * @returns ScheduleMetadata object or null if no schedule exists.
 */
export async function getCurrentSchedule(): Promise<ScheduleMetadata | null> {
  try {
    await connectToDatabase(); 

    // Find the single latest document in the Schedule collection
    const currentSchedule = await Schedule.findOne()
      .sort({ uploadDate: -1 })
      .lean(); 

    if (!currentSchedule) {
      return null;
    }

    return {
      id: currentSchedule.fileId.toString(), // Returns the GridFS file ID
      filename: currentSchedule.filename,
      uploadDate: currentSchedule.uploadDate,
      contentType: currentSchedule.contentType, 
    };
  } catch (error) {
    console.error("[Schedule Fetch] Error fetching current schedule:", error);
    return null;
  }
}