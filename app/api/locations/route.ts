import { connectToDatabase } from "@/app/_lib/db";
import Location from "@/app/_models/Location";
import { NextResponse } from "next/server";

// Next.js automatically loads environment variables, so direct access is fine.
const locationIQKey = process.env.LOCATIONIQ_API_KEY; 

// ---------------------------
// 🚢 GET (FETCH ALL LOCATIONS)
// ---------------------------
export async function GET() {
  try {
    await connectToDatabase();
    // Retrieve all locations
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
    await connectToDatabase();
    
    // Client must now send all fields for the updated model
    // Expected requestData: { name, address, country, description, status, destinations }
    const requestData = await request.json(); 

    const { name, address, country, description, status, destinations } = requestData;

    // Validation for new required fields
    if (!name || !address || !country || !description || !status) {
        return NextResponse.json(
          { message: "Missing required fields: name, address, country, description, and status are needed." },
          { status: 400 }
        );
    }
    
    // 1. GEOCODE THE ADDRESS
    const encodedAddress = encodeURIComponent(address);
    // Added addressdetails=1 to geocoding URL for potentially richer data
    const geocodeUrl = `https://us1.locationiq.com/v1/search?key=${locationIQKey}&q=${encodedAddress}&format=json&limit=1&addressdetails=1`; 

    const geocodeResponse = await fetch(geocodeUrl);

    if (!geocodeResponse.ok) {
      return NextResponse.json(
        { message: "Geocoding service failed to respond.", details: await geocodeResponse.text() },
        { status: geocodeResponse.status }
      );
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData || geocodeData.length === 0) {
      return NextResponse.json(
        { message: `Address not found: "${address}". Please check the spelling.` },
        { status: 404 }
      );
    }

    // 2. EXTRACT COORDINATES AND VERIFIED NAME
    const { lat, lon, display_name } = geocodeData[0];

    // 3. CONSTRUCT THE FINAL DATABASE OBJECT
    const locationToSave = {
      name: name,
      address: display_name, // Use the verified address from LocationIQ
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      // Include the NEW fields from the request body
      country: country,
      description: description,
      status: status,
      // Destinations array (optional/defaults to [])
      destinations: destinations || [], 
    };

    // 4. SAVE TO DATABASE
    const newLocation = await Location.create(locationToSave);

    // 5. Respond with the created document
    return NextResponse.json(newLocation, { status: 201 });
    
  } catch (error: any) {
    console.error("POST Location Error:", error);

    // Handle Mongoose Validation Error (missing fields, wrong types, enum violation)
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation failed against schema.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    
    // Handle Mongoose Duplicate Key Error
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