"use server";

import { connectToDatabase } from "../_lib/db";
import GalleryImage, { GalleryImageDocument } from "@/app/_models/GalleryImage";
import { uploadImage } from "./upload";
import mongoose, { Types } from "mongoose";

// --- CREATE (ADD) ---

/**
 * Uploads a file and creates a new GalleryImage reference document.
 * @param formData The FormData containing the file ('image').
 */
export async function addGalleryImage(
  formData: FormData
): Promise<GalleryImageDocument | { error: string }> {
  await connectToDatabase();

  // 1. Upload the file to GridFS first
  const uploadResult = await uploadImage(formData);

  if (!uploadResult.success || !uploadResult.fileId) {
    return { error: uploadResult.error || "Failed to upload image to GridFS." };
  }

  try {
    // 2. Create the Mongoose document referencing the new GridFS file ID
    const newImage = await GalleryImage.create({
      image: new Types.ObjectId(uploadResult.fileId),
    });

    // The document is now created and linked to the image data
    return JSON.parse(JSON.stringify(newImage)); // Return plain object for client component use
  } catch (e) {
    // If the document creation fails, clean up the orphaned GridFS file
    // NOTE: This step is crucial to prevent database clutter!
    await deleteGridFsFile(new Types.ObjectId(uploadResult.fileId));
    return { error: "Failed to create database entry." };
  }
}

// --- DELETE ---

/**
 * Deletes a GalleryImage document and the associated GridFS file chunks.
 * @param id The Mongoose document ID of the GalleryImage to delete.
 */
export async function deleteGalleryImage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await connectToDatabase();

  try {
    // 1. Find the Mongoose document to get the GridFS file ID
    const imageDoc = await GalleryImage.findById(id);

    if (!imageDoc) {
      return { success: false, error: "GalleryImage not found." };
    }

    const fileId = imageDoc.image; // This is the GridFS ObjectId

    // 2. Delete the Mongoose document
    await GalleryImage.deleteOne({ _id: id });

    // 3. Delete the associated GridFS file
    await deleteGridFsFile(fileId);

    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message || "Failed to delete image.",
    };
  }
}

/**
 * Internal helper to delete the actual file data from GridFS.
 */
async function deleteGridFsFile(fileId: Types.ObjectId): Promise<void> {
  const db: any = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });

  try {
    await bucket.delete(fileId);
  } catch (e) {
    console.error("Error deleting GridFS file:", fileId, e);
    // Log the error but continue, as the Mongoose document is already gone.
  }
}

// --- READ (GET) ---

/**
 * Retrieves all GalleryImage documents.
 */
export async function getAllGalleryImages(): Promise<GalleryImageDocument[]> {
  await connectToDatabase();

  const images = await GalleryImage.find({}).sort({ createdAt: -1 }).exec();

  // Return a plain object array for client components
  return JSON.parse(JSON.stringify(images));
}

/**
 * Retrieves a specific GalleryImage document by its Mongoose ID.
 */
export async function getGalleryImageById(
  id: string
): Promise<GalleryImageDocument | null> {
  await connectToDatabase();

  const image = await GalleryImage.findById(id).exec();

  if (!image) {
    return null;
  }

  // Return a plain object for client components
  return JSON.parse(JSON.stringify(image));
}
