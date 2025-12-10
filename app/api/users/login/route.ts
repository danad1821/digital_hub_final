import { connectToDatabase } from "@/app/_lib/db";
import User from "@/app/_models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Assuming you have 'bcryptjs' installed

// Define the shape for the request body for type safety
interface LoginBody {
    email?: string;
    password?: string;
}

export async function POST(request: Request) {
    // 1. Initialize Error Handling
    try {
        const body: LoginBody = await request.json();
        const { email, password } = body;

        // 2. Simple Input Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 } // Bad Request
            );
        }
        
        // 3. Connect to Database
        await connectToDatabase();

        // 4. Find the User
        // Use select('+password') if your User model schema excludes the password by default
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            // Do not disclose whether it was the email or password that was wrong for security
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 } // Unauthorized
            );
        }

        // 5. Compare Passwords
        // 'user.password' is the stored HASH; 'password' is the plain text from the request
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 } // Unauthorized
            );
        }

        
        const cookiesData: any = await cookies()
        // 7. Successful Login - Set the Cookie
        // The cookie can be simple or contain a JWT for more complex authentication
        cookiesData.set("user-role", "admin", {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/", // Available across the entire site
            sameSite: 'strict', // Security against CSRF
        });

        // 8. Return Success Response
        return NextResponse.json(
            { message: "Login successful.", role: "admin" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login API Error:", error);
        
        // Return a generic error response for internal server issues
        return NextResponse.json(
            { error: "An internal server error occurred during login." },
            { status: 500 }
        );
    }
}