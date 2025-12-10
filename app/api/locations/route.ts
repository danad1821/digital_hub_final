import { connectToDatabase } from "@/app/_lib/db";
import Location from "@/app/_models/Location";
import { NextResponse } from "next/server";

// --- IMPORTANT: Use a secure, server-only variable name ---
// Next.js automatically loads environment variables, so direct access is fine.
const locationIQKey = process.env.LOCATIONIQ_API_KEY; 

// Your existing GET function remains unchanged
export async function GET() {
  try {
    await connectToDatabase();
    const locations = await Location.find().lean();
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("GET locations Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch locations.", error: error },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  if (!locationIQKey) {
    return NextResponse.json(
      { message: "Server configuration error: LocationIQ API key not set." },
      { status: 500 }
    );
  }

  try {
    await connectToDatabase();
    const requestData = await request.json(); // { name, address, destinations }

    // 1. GEOCODE THE ADDRESS
    const encodedAddress = encodeURIComponent(requestData.address);
    const geocodeUrl = `https://us1.locationiq.com/v1/search?key=${locationIQKey}&q=${encodedAddress}&format=json&limit=1`;

    const geocodeResponse = await fetch(geocodeUrl);

    if (!geocodeResponse.ok) {
      // LocationIQ API call failed (e.g., bad key, rate limit)
      return NextResponse.json(
        { message: "Geocoding service failed to respond.", details: await geocodeResponse.text() },
        { status: geocodeResponse.status }
      );
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData || geocodeData.length === 0) {
      // LocationIQ found no matching address
      return NextResponse.json(
        { message: `Address not found: "${requestData.address}". Please check the spelling.` },
        { status: 404 }
      );
    }

    // 2. EXTRACT COORDINATES AND VERIFIED NAME
    const { lat, lon, display_name } = geocodeData[0];

    // 3. CONSTRUCT THE FINAL DATABASE OBJECT
    const locationToSave = {
      name: requestData.name,
      address: display_name, // Use the verified address from LocationIQ
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      // Pass the destinations array directly; Mongoose will validate it against the sub-schema
      destinations: requestData.destinations || [], 
    };

    // 4. SAVE TO DATABASE
    const newLocation = await Location.create(locationToSave);

    // 5. Respond with the created document
    return NextResponse.json(newLocation, { status: 201 });
    
  } catch (error: any) {
    console.error("POST Location Error:", error);

    // Handle specific Mongoose errors for better client feedback
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation failed. Check required fields and data types.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    
    // Handle Mongoose Duplicate Key Error (e.g., if 'name' is unique)
    if (error.code === 11000) {
        return NextResponse.json(
            {
                message: `Location with name '${error.keyValue.name}' already exists.`,
            },
            { status: 409 } // 409 Conflict
        );
    }

    // Fallback server error
    return NextResponse.json(
      {
        message: "Failed to create new Location.",
        error: error.message || "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}