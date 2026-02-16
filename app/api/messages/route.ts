import { connectToDatabase } from "@/app/_lib/db";
import { NextResponse } from "next/server";
import Message from "@/app/_models/Message";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { EmailTemplate } from "@/app/_components/EmailTemplate";

export async function GET() {
  try {
    await connectToDatabase();
    const messages = await Message.find().lean();
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Establish database connection first (Critical step)
    await connectToDatabase();

    // 2. Save message to database
    // This is the most likely place an error (like schema validation) would occur.
    const newMessage: any = await Message.create(body);

    // 3. Send email notification via Resend
    // 1. Create a transporter (using Gmail as an example)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 2. Render your React template to HTML string
    const emailHtml = await render(
      EmailTemplate({
        fullName: newMessage.fullName,
        company: newMessage.company,
        email: newMessage.email,
        message: newMessage.message,
      }),
    );

    // 3. Send the email
    try {
      const info = await transporter.sendMail({
        from: `"Alta Maritime - Contact Form (on website)" <${process.env.SMTP_USER}>`,
        to: "chartering@altamaritime.com",
        subject: "Alta Maritime Inquiry",
        html: emailHtml, // This replaces the 'react' property
      });

      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      return NextResponse.json({ message: "Failed to send email" });
      console.error("Error sending email:", error);
    }

    // Success response
    return NextResponse.json({ newMessage: newMessage }, { status: 201 });
  } catch (error) {
    // Catch database connection, Mongoose validation, or JSON parsing errors.
    console.error(
      "Failed to process message (DB or Validation Error): ",
      error,
    );
    return NextResponse.json(
      {
        error: "Failed to process message.",
        // IMPORTANT: Return the specific error message to aid debugging (e.g., Mongoose validation failure)
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
