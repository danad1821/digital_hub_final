import { connectToDatabase } from "@/app/_lib/db";
import { NextResponse } from "next/server";
import Service from "@/app/_models/Service";

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
