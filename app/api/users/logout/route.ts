import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookiesData = await cookies();
        
        // Delete the JWT cookie
        cookiesData.delete("auth-token"); 

        return NextResponse.json(
            { message: "Logout successful." },
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Logout API Error:", error);
        return NextResponse.json(
            { error: "An internal server error occurred." },
            { status: 500 }
        );
    }
}