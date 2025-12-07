'use server'

import { connectToDatabase } from '../_lib/db';
import mongoose, { Types } from 'mongoose';
import { Readable } from 'stream';

// Define the expected return type for the upload action
interface UploadResult {
  success: boolean;
  fileId?: string;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  // 1. Extract file and check type
  const fileEntry = formData.get('image');
  if (!fileEntry || typeof fileEntry === 'string') {
    return { success: false, error: 'No valid file uploaded' };
  }
  const file = fileEntry as File;

  // Next.js body parser limits apply here!
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File size exceeds 50MB limit for in-memory buffer.' };
  }
  
  // 2. Connect to DB
  const connection = await connectToDatabase();
  
  // 3. Convert file to Buffer (needed for GridFS write stream)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 4. Create GridFS Bucket
  const db:any = connection.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'uploads'
  });

  // 5. Upload using a Promise wrapper
  const uploadPromise: Promise<Types.ObjectId> = new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type || 'binary/octet-stream',
    });

    // === DIAGNOSTIC LOG 1: ID Assigned ===
    console.log(`[Upload] Uploading file: ${file.name}, GridFS ID assigned: ${uploadStream.id.toHexString()}`);

    const readStream = Readable.from(buffer);

    readStream
      .pipe(uploadStream)
      .on('finish', () => {
         // === DIAGNOSTIC LOG 2: Success Confirmation ===
         console.log(`[Upload] Stream finished successfully. Final GridFS ID: ${uploadStream.id.toHexString()}`);
         resolve(uploadStream.id);
      })
      .on('error', (error) => {
         // === ERROR LOG: Stream Failure ===
         console.error("[Upload] Stream Error during upload:", error);
         reject(error);
      });
  });

  try {
    const fileId = await uploadPromise;
    // Note: The fileId is logged here if it saves successfully
    console.log(`[Upload] Successfully saved GalleryImage entry with ID: ${fileId.toString()}`);
    return { success: true, fileId: fileId.toString() };
  } catch (error) {
    // Ensure we return a string error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    return { success: false, error: errorMessage };
  }
}