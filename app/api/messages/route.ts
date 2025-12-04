import { connectToDatabase } from "@/app/_lib/db";
import { NextResponse } from "next/server";
import Message from "@/app/_models/Message";
import { Resend } from "resend";
import { EmailTemplate } from "@/app/_components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error(error);
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
    const { data, error } = await resend.emails.send({
      from: "Alta Maritime <onboarding@resend.dev>",
      to: "danadabdoub@gmail.com",
      subject: "Alta Maritime Inquiry",
      react: EmailTemplate({
        fullName: newMessage.fullName, // Use data from the successfully saved object
        phone: newMessage.phone,
        email: newMessage.email,
        message: newMessage.message,
      }),
    });

    if (error) {
      console.error("Error sending email via Resend (Note: Message was saved): ", error);
      // If the email fails, the primary action (saving the message) still succeeded.
      // We return 201 with a warning, rather than a hard 500 error.
      return NextResponse.json({
        newMessage: newMessage,
        warning: "Message saved, but failed to send email notification.",
        emailError: error
      }, { status: 201 });
    }

    // Success response
    return NextResponse.json({ newMessage: newMessage, data: data }, { status: 201 });
  } catch (error) {
    // Catch database connection, Mongoose validation, or JSON parsing errors.
    console.error("Failed to process message (DB or Validation Error): ", error);
    return NextResponse.json(
      { 
        error: "Failed to process message.",
        // IMPORTANT: Return the specific error message to aid debugging (e.g., Mongoose validation failure)
        details: (error as Error).message, 
      },
      { status: 500 }
    );
  }
}