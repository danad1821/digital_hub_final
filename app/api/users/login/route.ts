import { connectToDatabase } from "@/app/_lib/db";
import User from "@/app/_models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // 💡 JWT Library Import

// Define the shape for the request body for type safety
interface LoginBody {
    email?: string;
    password?: string;
}

// Define the shape for the JWT payload
interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export async function POST(request: Request) {
    try {
        const body: LoginBody = await request.json();
        const { email, password } = body;
        
        // 1. Simple Input Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 } // Bad Request
            );
        }
        
        // 2. Database Connection and Secret Check
        await connectToDatabase();
        
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            // Log for server admin, return generic error to client
            console.error("Configuration Error: JWT_SECRET environment variable is not set.");
            return NextResponse.json(
                { error: "Server configuration error." },
                { status: 500 }
            );
        }

        // 3. Find the User
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            // Security: Don't reveal if it's the email or password that is wrong
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 } // Unauthorized
            );
        }

        // 4. Compare Passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 } // Unauthorized
            );
        }

        // 5. 🔑 Generate the JWT
        const payload: JwtPayload = {
            userId: user._id.toString(), // Convert ObjectId to string for JWT
            email: user.email,
            role: user.role || "user", // Assuming user role is stored in the user document
        };

        const token = jwt.sign(
            payload, 
            jwtSecret, 
            { expiresIn: '7d' } // Token expires in 7 days
        );
        

        // 6. Set the Secure Cookie
        const cookiesData = await cookies();
        
        cookiesData.set("auth-token", token, { // Set the JWT under the name 'auth-token'
            httpOnly: true, // Prevents client-side JavaScript access (essential for security)
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
            maxAge: 60 * 60 * 24 * 7, // 1 week (matches token expiry)
            path: "/", // Available across the entire domain
            sameSite: 'strict', // Helps mitigate Cross-Site Request Forgery (CSRF)
        });

        // 7. Return Success Response
        return NextResponse.json(
            { message: "Login successful.", role: payload.role },
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