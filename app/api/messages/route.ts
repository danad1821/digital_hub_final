import pool from "@/app/_lib/db"; //
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { EmailTemplate } from "@/app/_components/EmailTemplate";

// ---------------------------
// 📩 GET (FETCH ALL MESSAGES)
// ---------------------------
export async function GET() {
  try {
    // Select all messages ordered by newest first
    const [rows] = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET messages Error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// ---------------------------
// ✉️ POST (CREATE & NOTIFY)
// ---------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, message, company } = body;

    // 1. Basic Validation
    if (!fullName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Save message to MySQL database
    const [result]: any = await pool.query(
      "INSERT INTO messages (full_name, email, message, company) VALUES (?, ?, ?, ?)",
      [fullName, email, message, company || null]
    );

    const messageId = result.insertId;

    // 3. Send email notification via SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailHtml = await render(
      EmailTemplate({
        fullName,
        company: company || "Not Provided",
        email,
        message,
      }),
    );

    try {
      await transporter.sendMail({
        from: `"Alta Maritime - Website" <${process.env.SMTP_USER}>`,
        to: "chartering@altamaritime.com",
        subject: "New Website Inquiry",
        html: emailHtml,
      });
    } catch (mailError) {
      console.error("Email notification failed, but message was saved to DB:", mailError);
      // We return 201 because the data was successfully saved to the database
    }

    return NextResponse.json({ id: messageId, status: "Message saved" }, { status: 201 });

  } catch (error: any) {
    console.error("POST Message Error:", error);
    return NextResponse.json(
      { error: "Failed to process message.", details: error.message },
      { status: 500 }
    );
  }
}