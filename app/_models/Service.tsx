import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          description: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
