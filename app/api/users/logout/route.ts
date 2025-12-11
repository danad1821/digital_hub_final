import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // 1. Get the cookies object
        const cookiesData = await cookies();
        
        // 2. Delete the JWT cookie
        // 💡 CRITICAL CHANGE: Target the 'auth-token' cookie, not 'user-role'.
        cookiesData.delete("auth-token"); 

        // 3. Optional: Delete any other related cookies (if you had them)
        // cookiesData.delete("other-cookie-name");

        // 4. Return a success response
        // The browser will automatically clear the cookie on the client side.
        return NextResponse.json(
            { message: "Logout successful." },
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Logout API Error:", error);

        // Return a generic error response
        return NextResponse.json(
            { error: "An internal server error occurred during logout." },
            { status: 500 }
        );
    }
}