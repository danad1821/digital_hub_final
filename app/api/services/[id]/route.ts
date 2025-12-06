import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/_lib/db";
import Service from "@/app/_models/Service";
import { ObjectId } from "mongodb";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const data = await request.json();
    const updatedService = await Service.findByIdAndUpdate(
      new ObjectId(id),
      data,
      { new: true }
    );
    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(updatedService, { status: 200 });
  } catch (error: any) {
    console.error("Error updating Service:", error);
    return NextResponse.json(
      {
        message: "Failed to create new service.",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const deletedService = await Service.findByIdAndDelete(new ObjectId(id));
    if (!deletedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Service:", error);
    return NextResponse.json(
      { error: "Failed to delete Service" },
      { status: 500 }
    );
  }
}
