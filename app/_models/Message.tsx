import mongoose from "mongoose";

// Define the structure of the document
const MessageSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      maxlength: [60, "Full name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
    },
    // The field name is now 'message' to match the client form
    message: {
      type: String,
      required: [true, "Message content is required."],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot be more than 20 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Check if the model already exists to prevent re-compilation in development
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;