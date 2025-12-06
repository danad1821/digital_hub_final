import { connectToDatabase } from "@/app/_lib/db";
import { NextResponse } from "next/server";
import Service from "@/app/_models/Service";
import getGridFSBucket from "@/app/_lib/GridFS";

// --- START: File Handling Helpers (GridFS Integration) ---

async function parseFormData(request: Request) {
  // This function must parse the 'multipart/form-data' body.
  // It should return an object containing text fields and file objects.

  const formData = await request.formData();
  const fields: any = {};
  const files: any = {}; // Map of file field name to File object

  // Iterate over the form data entries
  for (const [key, value] of formData.entries()) {
    // Next.js 'File' objects inherit from the global File interface
    // Check if the value is a File object (has 'size' and 'name' properties)
    if (
      typeof value === "object" &&
      value !== null &&
      "size" in value &&
      typeof value.size === "number"
    ) {
      files[key] = value;
    } else {
      fields[key] = value;
    }
  }

  return { fields, files };
}

// In a real Mongoose/GridFS setup, this function would handle the streaming
// of the file data into MongoDB using GridFSBucket.
async function uploadFileStreamToGridFS(
  file: any,
  filename: string
): Promise<string> {
  // 1. Get the bucket instance
  const bucket = getGridFSBucket(); // Use the function defined above

  // 2. Open an upload stream
  const uploadStream = bucket.openUploadStream(filename, {
    // Optional: Include file metadata (like MIME type)
    contentType: file.type || "application/octet-stream",
  });

  // 3. Convert the File object to a Node.js Readable Stream (required for piping)
  // Node.js v16.5+ environments support this:
  const readableStream = file.stream();

  // 4. Pipe the file stream data to the GridFS upload stream
  // Ensure you use a proper stream conversion if 'file.stream()' isn't available

  // Convert WebStream to Node.js ReadableStream and pipe
  // (This conversion might vary based on your exact Node/Next.js runtime)
  return new Promise((resolve, reject) => {
    // This is a common way to convert a File to a ReadableStream
    // Note: You may need a library like 'stream/web' for full compatibility
    const buffer = Buffer.from(file.arrayBuffer());

    // The uploadStream handles the piping and saving to MongoDB
    uploadStream.write(buffer);
    uploadStream.end();

    uploadStream.on("error", (err: any) => {
      console.error("GridFS Upload Error:", err);
      reject(err);
    });

    // The 'finish' event provides the ObjectId (_id) of the file saved
    uploadStream.on("finish", () => {
      console.log(`GridFS upload finished. File ID: ${uploadStream.id}`);
      // Resolve the promise with the MongoDB ObjectId (must be converted to string)
      resolve(uploadStream.id.toString());
    });
  });
}

// --- END: File Handling Helpers ---

// === GET Handler: Fetch All Services ===
/**
 * @method GET
 * @returns A list of all services from the MongoDB database.
 */
export async function GET() {
  try {
    await connectToDatabase();

    // Find all services in the database
    const services = await Service.find().lean();

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("GET Services Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch services.", error: error },
      { status: 500 }
    );
  }
}

// === POST Handler: Create a New Service (Updated for GridFS) ===
/**
 * @method POST
 * @param {Request} request - The incoming request object containing service data (multipart/form-data).
 * @returns The newly created service document.
 */
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newService = await Service.create(data);
    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    console.error("POST Service Error:", error);

    // Handle specific Mongoose errors for better client feedback

    // Mongoose Validation Error (required fields missing, wrong type, etc.)
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation failed. Check required fields and data types.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // Fallback server error
    return NextResponse.json(
      {
        message: "Failed to create new service.",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
