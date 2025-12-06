import { connectToDatabase } from "@/app/_lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Message from "@/app/_models/Message";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const {id} = await params; 
        await connectToDatabase();
        const deletedMessage = await Message.findByIdAndDelete(new ObjectId(id));
        if (!deletedMessage) {
            return NextResponse.json(
                { error: "Message not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting Message:", error);
        return NextResponse.json(
            { error: "Failed to delete Message" },
            { status: 500 }
        );
    }
}
