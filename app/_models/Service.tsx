import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {type: String, required: true},
    summary: {type: String, required: true},
    description: {type: String, required: true},
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
