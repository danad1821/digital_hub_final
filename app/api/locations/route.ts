import pool from "@/app/_lib/db"; //
import { NextResponse } from "next/server";

const locationIQKey = process.env.LOCATIONIQ_API_KEY;

// ---------------------------
// 🚢 GET (FETCH ALL LOCATIONS)
// ---------------------------
export async function GET() {
  try {
    // MySQL query to fetch all locations
    const [rows] = await pool.query("SELECT * FROM locations ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET locations Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch locations.", error: error },
      { status: 500 }
    );
  }
}

// ---------------------------
// 📦 POST (CREATE NEW LOCATION)
// ---------------------------
export async function POST(request: Request) {
  if (!locationIQKey) {
    return NextResponse.json(
      { message: "Server configuration error: LocationIQ API key not set." },
      { status: 500 }
    );
  }

  try {
    const requestData = await request.json();
    const { name, address, country, description, status, type } = requestData;
    const emails = typeof requestData.emails === "string" ? requestData.emails : "";
    const phones = typeof requestData.phones === "string" ? requestData.phones : "";

    if (!name || !address || !country || !description || !status || !type) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 1. GEOCODE THE ADDRESS
    const encodedAddress = encodeURIComponent(address);
    const geocodeUrl = `https://us1.locationiq.com/v1/search?key=${locationIQKey}&q=${encodedAddress}&format=json&limit=1&addressdetails=1`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeResponse.ok || !geocodeData.length) {
      return NextResponse.json({ message: "Address not found." }, { status: 404 });
    }

    const { lat, lon, display_name } = geocodeData[0];

    // 2. SAVE TO MYSQL
    // Note: If you kept MongoDB IDs as strings, use VARCHAR(24) for the ID column.
    // If using AUTO_INCREMENT, let MySQL handle the ID.
    const [result]: any = await pool.query(
      `INSERT INTO locations (name, address, country, emails, phones, lat, lng, description, status, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, display_name, country, emails, phones, parseFloat(lat), parseFloat(lon), description, status, type]
    );

    return NextResponse.json({ id: result.insertId, name }, { status: 201 });
  } catch (error: any) {
    console.error("POST Location Error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: "Location name already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}