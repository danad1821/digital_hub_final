// /app/api/schedule/[fileId]/route.ts

import { connectToDatabase } from '@/app/_lib/db'; // Adjust path as needed
import mongoose, { Types } from 'mongoose';
import { NextResponse } from 'next/server';

// Get the DB connection and GridFS Bucket
async function getBucket() {
  const connection = await connectToDatabase();
  const db: any = connection.connection.db;
  return new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
}

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const bucket = await getBucket();
    const {fileId} = await params;
    const objectId = new Types.ObjectId(fileId);

    // Fetch the file metadata to get the content type
    const file = await bucket.find({ _id: objectId }).next();
    if (!file) {
        return new NextResponse('File not found', { status: 404 });
    }

    // Create a read stream from GridFS
    const downloadStream = bucket.openDownloadStream(objectId);

    // Convert the stream to a Web Stream
    const webStream = new ReadableStream({
      start(controller) {
        downloadStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });
        downloadStream.on('end', () => {
          controller.close();
        });
        downloadStream.on('error', (err) => {
          console.error("Download Stream Error:", err);
          controller.error(err);
        });
      },
    });

    // Return the stream as a response
    return new NextResponse(webStream, {
      status: 200,
      headers: {
        // Set the appropriate Content-Type for the PDF
        'Content-Type': file.metadata?.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${file.filename}"`,
      },
    });
  } catch (e) {
    console.error('API Error:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}