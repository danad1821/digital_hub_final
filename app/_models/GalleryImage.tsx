import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    // This is the reference to the file stored in GridFS
    image: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

// Define a type for the GalleryImage document for TypeScript
export type GalleryImageDocument = mongoose.Document & {
  image: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const GalleryImage = (mongoose.models.GalleryImage ||
  mongoose.model<GalleryImageDocument>(
    "GalleryImage",
    galleryImageSchema
  )) as mongoose.Model<GalleryImageDocument>;

export default GalleryImage;
