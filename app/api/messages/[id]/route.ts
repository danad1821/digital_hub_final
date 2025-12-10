import { connectToDatabase } from "@/app/_lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Message from "@/app/_models/Message";

export async function PUT(request: Request, { params }: { params: { id: string } }){
    try {
        await connectToDatabase();
        const { id } = await params;
        
        // 1. Get the update data from the request body
        // *** CHANGE: Destructuring to 'message' to match the schema ***
        const body = await request.json(); 

        // 2. Find the message by ID and update it
        // *** CHANGE: Setting the 'message' field in the update object ***
        const updatedMessage = await Message.findByIdAndUpdate(
            new ObjectId(id),
            { isRead: body.isRead }, // The fields to update: { schemaFieldName: variableName }
            { new: true } // Return the updated document
        );

        if (!updatedMessage) {
            return NextResponse.json(
                { error: "Message not found" },
                { status: 404 }
            );
        }

        // 3. Return a success response with the updated message
        return NextResponse.json(updatedMessage, { status: 200 });

    } catch (error) {
        console.error("Error updating Message:", error);
        return NextResponse.json(
            { error: "Failed to update Message" },
            { status: 500 }
        );
    }
}

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
