// models/Page.ts

import mongoose, { Schema, Document, Model } from "mongoose";

const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  page_title: { type: String, required: true },
  status: { type: String, enum: ["published", "draft"], default: "draft" },
  last_updated: { type: Date, default: Date.now },
  sections: { type: Array, required: true }, // Simple array structure for flexibility
});

// Avoid recompiling the model in development mode
const Page = mongoose.models.Page || mongoose.model("Page", pageSchema);
export default Page;
