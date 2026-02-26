import pool from "@/app/_lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface LoginBody {
    email?: string;
    password?: string;
}

interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export async function POST(request: Request) {
    try {
        const body: LoginBody = await request.json();
        const { email, password } = body;

        // 1. Input Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not set.");
            return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
        }

        // 2. Find the User in MySQL
        // Note: Using id as a string (VARCHAR) if you migrated MongoDB ObjectIds
        const [rows]: any = await pool.query(
            "SELECT id, email, password, role FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        const user = rows[0];

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        // 3. Compare Passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        // 4. Generate the JWT
        const payload: JwtPayload = {
            userId: user.id.toString(),
            email: user.email,
            role: user.role || "user",
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

        // 5. Set the Secure Cookie
        const cookiesData = await cookies();
        cookiesData.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: 'lax',
        });

        return NextResponse.json(
            { message: "Login successful.", role: payload.role },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { error: "An internal server error occurred." },
            { status: 500 }
        );
    }
}