import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/_lib/db";
import Location from "@/app/_models/Location"; // Assuming you export your Mongoose model as 'Location'
import { ObjectId } from "mongodb";

// Your LocationIQ Key (Needs to be defined if not already in the file)
const locationIQKey = process.env.LOCATIONIQ_API_KEY; 

// Helper function to extract the country from LocationIQ data
// This is needed if the address is updated
function getCountryFromGeocodeData(geocodeData: any): string | undefined {
    // Check if the first result has the expected 'address' object
    if (geocodeData && geocodeData.length > 0 && geocodeData[0].address) {
        return geocodeData[0].address.country;
    }
    // Fallback: Attempt to extract from the display name 
    const displayNameParts = geocodeData[0]?.display_name?.split(',');
    if (displayNameParts && displayNameParts.length > 1) {
        return displayNameParts[displayNameParts.length - 1].trim();
    }
    return undefined; // Country could not be determined
}


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    // Get the fields the user wants to update
    const dataToUpdate = await request.json(); 
    let finalUpdateData = { ...dataToUpdate };

    // --- GEOCODING LOGIC (Only if the address is being updated) ---
    if (finalUpdateData.address) {
      if (!locationIQKey) {
        return NextResponse.json(
          { message: "Server configuration error: LocationIQ API key not set." },
          { status: 500 }
        );
      }
      
      const encodedAddress = encodeURIComponent(finalUpdateData.address);
      // ADDED &addressdetails=1 to geocoding URL
      const geocodeUrl = `https://us1.locationiq.com/v1/search?key=${locationIQKey}&q=${encodedAddress}&format=json&limit=1&addressdetails=1`; 
      
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (!geocodeResponse.ok || geocodeData.length === 0) {
        return NextResponse.json(
          { 
            message: `Failed to geocode new address: "${finalUpdateData.address}". Please try again.`
          },
          { status: 400 }
        );
      }

      // Extract new coordinates and verified address
      const { lat, lon, display_name } = geocodeData[0];
      
      // Add the geocoded data to the update object
      finalUpdateData.lat = parseFloat(lat);
      finalUpdateData.lng = parseFloat(lon);
      finalUpdateData.address = display_name;

      // NEW: Extract and update the country if the address changed
      const verifiedCountry = getCountryFromGeocodeData(geocodeData);
      if (verifiedCountry) {
          finalUpdateData.country = verifiedCountry;
      }
    }
    // --- END GEOCODING LOGIC ---
    
    // NOTE ON REQUIRED FIELDS:
    // If the client does NOT send a required field (like 'country'), Mongoose 
    // will assume the client isn't changing it and leave the existing value.
    // If the client sends an empty value (like { country: '' }), Mongoose validation will fail.
    // The `{ runValidators: true }` option below handles this robustly.

    // Perform the update using the potentially updated `finalUpdateData`
    const updatedLocation = await Location.findByIdAndUpdate(
      new ObjectId(id),
      finalUpdateData,
      { new: true, runValidators: true } // { runValidators: true } is essential here
    );

    if (!updatedLocation) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedLocation, { status: 200 });
  } catch (error: any) {
    console.error("Error updating Location:", error);
    
    // Mongoose Validation Error (will catch if 'country', 'description', or 'status' are updated to empty strings/invalid enum values)
    if (error.name === "ValidationError") {
        return NextResponse.json(
            { message: "Update validation failed. Check required fields and data types." },
            { status: 400 }
        );
    }
    
    // Mongoose Cast Error (e.g., invalid ObjectId)
    if (error.name === "CastError") {
        return NextResponse.json(
            { message: "Invalid Location ID format." },
            { status: 400 }
        );
    }

    return NextResponse.json(
      {
        message: "Failed to update Location.",
        error: error.message || "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}

// ---------------------------
// 🗑️ DELETE (REMAINS UNCHANGED)
// ---------------------------
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    // 1. Delete the primary location document
    const deletedLocation = await Location.findByIdAndDelete(new ObjectId(id));
    
    if (!deletedLocation) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }
    
    // 2. Remove the deleted location from all other locations' destinations arrays
    // Use the name for comparison as that's what's stored in the destination sub-document
    await Location.updateMany(
      {}, // Target all documents
      { $pull: { destinations: { name: deletedLocation.name } } } 
    );

    return NextResponse.json(
      { message: `Location "${deletedLocation.name}" deleted successfully. References removed.` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting Location:", error);
    
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
        return NextResponse.json(
            { error: "Invalid Location ID format." },
            { status: 400 }
        );
    }

    return NextResponse.json(
      { error: "Failed to delete Location." },
      { status: 500 }
    );
  }
}