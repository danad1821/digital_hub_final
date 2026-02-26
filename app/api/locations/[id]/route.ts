import pool from "@/app/_lib/db"; //
import { NextResponse } from "next/server";

const locationIQKey = process.env.LOCATIONIQ_API_KEY;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dataToUpdate = await request.json();
    let { name, address, country, description, status, lat, lng } = dataToUpdate;

    // Geocoding logic if address changes
    if (address && !lat) {
      const encodedAddress = encodeURIComponent(address);
      const geocodeUrl = `https://us1.locationiq.com/v1/search?key=${locationIQKey}&q=${encodedAddress}&format=json&limit=1&addressdetails=1`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeResponse.ok && geocodeData.length > 0) {
        lat = parseFloat(geocodeData[0].lat);
        lng = parseFloat(geocodeData[0].lon);
        address = geocodeData[0].display_name;
        if (geocodeData[0].address?.country) country = geocodeData[0].address.country;
      }
    }

    // Dynamic SQL Update
    const [result]: any = await pool.query(
      `UPDATE locations SET 
        name = COALESCE(?, name), 
        address = COALESCE(?, address), 
        country = COALESCE(?, country), 
        lat = COALESCE(?, lat), 
        lng = COALESCE(?, lng), 
        description = COALESCE(?, description), 
        status = COALESCE(?, status)
       WHERE id = ?`,
      [name, address, country, lat, lng, description, status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // In SQL, relationships are usually handled by Foreign Key constraints.
    // If 'destinations' was a JSON field in another table, you'd update that here.
    const [result]: any = await pool.query("DELETE FROM locations WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Location deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}