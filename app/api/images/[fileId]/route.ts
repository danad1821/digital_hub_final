import { connectToDatabase } from "@/app/_lib/db";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server";
import { Readable } from "stream";

// The standard Next.js App Router function signature for dynamic parameters
export async function GET(
  request: Request,
 { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params; // Safely access the dynamic segment from destructured params

  // Added a check to prevent errors if fileId is still missing
  if (!fileId) {
    return new NextResponse("Missing File ID in URL", { status: 400 });
  }

  try {
    // 1. Convert string fileId to ObjectId
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(fileId);
    } catch (e) {
      return new NextResponse("Invalid File ID format", { status: 400 });
    }

    // 2. Database Connection and GridFS Setup
    const connection = await connectToDatabase();
    const db: any = connection.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });

    // 3. Look up file metadata by ID (using _id)
    const files = await bucket.find({ _id: objectId }).toArray();

    if (!files.length) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = files[0];

    // 4. Create a stream to read from GridFS by ID
    const downloadStream = bucket.openDownloadStream(objectId);

    // 5. Convert Node stream to Web ReadableStream for NextResponse
    const stream = new ReadableStream({
      start(controller) {
        downloadStream.on("data", (chunk) => controller.enqueue(chunk));
        downloadStream.on("end", () => controller.close());
        downloadStream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": file.contentType || "image/jpeg",
        "Content-Disposition": `filename="${file.filename}"`,
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error during retrieval", {
      status: 500,
    });
  }
}
