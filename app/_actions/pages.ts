"use server";

import { connectToDatabase } from "../_lib/db";
import Page from "@/app/_models/Page";
import { Types } from "mongoose";
import { uploadImage, UploadResult } from "./upload"; 
import mongoose from "mongoose";
// NOTE: Make sure to update your actual Mongoose model (../_models/Page) 
// to include the 'headerImageId' field as a Types.ObjectId.

// Use a placeholder type for reference. This now includes the image ID.
type PageDocument = {
    _id: Types.ObjectId;
    slug: string;
    title: string;
    content: string;
    headerImageId?: Types.ObjectId | null; // <--- NEW FIELD
    createdAt: Date;
    updatedAt: Date;
};

// ---------------------------
// --- READ (GET) ACTIONS ---
// ---------------------------

/**
 * Retrieves the content for a static page by its unique slug.
 */
export async function getStaticPageContent(
  slug: string
): Promise<PageDocument | null> {
  await connectToDatabase();

  try {
    const page = await Page.findOne({ slug: slug }).exec();
    if (!page) {
      return null;
    }
    return JSON.parse(JSON.stringify(page));
  } catch (error) {
    console.error(`Error fetching page content for slug '${slug}':`, error);
    return null;
  }
}

// ---------------------------
// --- UPDATE (PATCH) ACTIONS ---
// ---------------------------

/**
 * Updates the title and content for an existing static page.
 */
export async function updateStaticPageContent(
  slug: string,
  title: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  await connectToDatabase();

  if (!title || !content) {
      return { success: false, error: "Title and content cannot be empty." };
  }

  try {
    const updateResult = await Page.findOneAndUpdate(
      { slug: slug },
      { $set: { title: title, content: content, updatedAt: new Date() } },
      { new: true } 
    ).exec();

    if (!updateResult) {
      return { success: false, error: `Page with slug '${slug}' not found.` };
    }
    return { success: true };
  } catch (e) {
    const errorMessage = (e as Error).message || "Failed to update page content.";
    console.error("Error updating page content:", e);
    return { success: false, error: errorMessage };
  }
}

// ---------------------------
// --- PAGE IMAGE ACTIONS ---
// ---------------------------

/**
 * Uploads a new header image and updates the page document reference.
 * It will automatically delete any old image file in GridFS if one exists.
 * @param slug The unique identifier for the page.
 * @param formData The FormData containing the new file ('image').
 */
export async function addPageImage(
  slug: string,
  formData: FormData
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  await connectToDatabase();

  let uploadResult: UploadResult;
  try {
    // 1. Upload the new file using the generic utility function
    uploadResult = await uploadImage(formData); 
  } catch (e) {
    return { success: false, error: "File upload failed." };
  }
  
  if (!uploadResult.success || !uploadResult.fileId) {
    return { success: false, error: uploadResult.error || "Failed to upload image." };
  }

  try {
    // 2. Find the existing page document to check for an old image
    const page: PageDocument | null = await Page.findOne({ slug: slug }).exec();

    if (!page) {
      // Clean up the newly uploaded file if the page doesn't exist
      await deletePageImageByFileId(uploadResult.fileId); 
      return { success: false, error: `Page with slug '${slug}' not found.` };
    }

    // Capture the old file ID for cleanup
    const oldFileId = page.headerImageId ? page.headerImageId.toString() : null;

    // 3. Update the Page document with the new GridFS file ID
    await Page.updateOne(
      { slug: slug },
      { $set: { headerImageId: new Types.ObjectId(uploadResult.fileId), updatedAt: new Date() } }
    ).exec();

    // 4. Clean up the old GridFS file (if one existed)
    if (oldFileId) {
        await deletePageImageByFileId(oldFileId);
    }

    return { success: true, fileId: uploadResult.fileId };
  } catch (e) {
    // If the DB update fails, clean up the newly uploaded GridFS file
    await deletePageImageByFileId(uploadResult.fileId);
    console.error("Error updating page image reference:", e);
    return { success: false, error: "Failed to update page image reference." };
  }
}

export async function deletePageImageByFileId(
  fileId: string
): Promise<{ success: boolean; error?: string }> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(fileId)) {
    return { success: false, error: "Invalid file ID format." };
  }

  const db: any = mongoose.connection.db;
  // NOTE: Ensure 'uploads' matches the bucketName used in the upload function
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  
  try {
    // Delete the file using its ObjectId
    await bucket.delete(new Types.ObjectId(fileId));
    return { success: true };
  } catch (e) {
    // If the file doesn't exist, GridFS will still throw an error
    const errorMessage = (e as Error).message || "Failed to delete GridFS file.";
    console.error("Error deleting GridFS file:", fileId, e);
    return { success: false, error: errorMessage };
  }
}

export async function updatePageSectionImage(
  slug: string,
  sectionType: string,
  formData: FormData
): Promise<{ success: boolean; error?: string; newFileId?: string }> {
  await connectToDatabase();

  // 1. Upload the new file to GridFS
  const uploadResult = await uploadImage(formData);

  if (!uploadResult.success || !uploadResult.fileId) {
    return { success: false, error: uploadResult.error || "Failed to upload new image." };
  }
  
  const newFileId = uploadResult.fileId;
  let oldFileId: string | undefined;

  try {
    // 2. Find the current page document
    const pageDoc = await Page.findOne({ slug: slug }).exec();

    if (!pageDoc) {
      await deletePageImageByFileId(newFileId);
      return { success: false, error: `Page with slug '${slug}' not found.` };
    }

    // Find the specific section index
    const sectionIndex = pageDoc.sections.findIndex((s: any) => s.type === sectionType);

    if (sectionIndex === -1) {
      await deletePageImageByFileId(newFileId);
      return { success: false, error: `Section type '${sectionType}' not found on page '${slug}'.` };
    }

    // Get the old file ID before update
    // We assume data is defined on the section object
    oldFileId = pageDoc.sections[sectionIndex].data?.image_ref?.toString();
    
    // 3. Update the Mongoose document using dot notation to target the nested field
    const updatePath = `sections.${sectionIndex}.data.image_ref`;
    
    const updateResult = await Page.findOneAndUpdate(
      { slug: slug },
      // Convert string fileId back to Mongoose ObjectId for storage
      { $set: { [updatePath]: new Types.ObjectId(newFileId), updatedAt: new Date() } },
      { new: true }
    ).exec();

    if (!updateResult) {
        // If update somehow fails after finding, clean up new file
        await deletePageImageByFileId(newFileId);
        return { success: false, error: `Failed to update page image reference.` };
    }
    
    // 4. Delete the OLD image from GridFS (Cleanup)
    if (oldFileId) {
        // Delete asynchronously (or synchronously if you prefer to ensure cleanup)
        // Logging the error if cleanup fails is sufficient for production logic.
        deletePageImageByFileId(oldFileId)
            .catch(err => console.error(`[Cleanup Error] Failed to delete old GridFS file ${oldFileId}:`, err));
    }
    
    return { success: true, newFileId: newFileId };

  } catch (e) {
    // General failure cleanup
    await deletePageImageByFileId(newFileId);
    const errorMessage = (e as Error).message || "Failed to update page image content.";
    console.error("Error updating page image:", e);
    return { success: false, error: errorMessage };
  }
}