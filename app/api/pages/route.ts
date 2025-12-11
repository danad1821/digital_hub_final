import { connectToDatabase } from "@/app/_lib/db";
import Page from "@/app/_models/Page";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const pages = await Page.find().lean();
    return NextResponse.json(pages, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch pages.", error: error },
      { status: 500 }
    );
  }
}
