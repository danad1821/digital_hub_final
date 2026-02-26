"use server";

import pool from "@/app/_lib/db"; //
import { saveLocalFile, deleteLocalFile } from "@/app/_lib/file-helper";
import { revalidatePath } from "next/cache";

/**
 * CREATE: Saves image to disk and URL to MySQL
 */
export async function addGalleryImage(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const imageFile = formData.get('image') as File;

    if (!title?.trim() || !imageFile) {
      return { error: "Title and Image are required." };
    }

    // 1. Save file to local disk
    const imageUrl = await saveLocalFile(imageFile, "gallery");

    // 2. Save record to MySQL
    const [result]: any = await pool.query(
      "INSERT INTO gallery_images (title, image_url) VALUES (?, ?)",
      [title, imageUrl]
    );

    revalidatePath("/gallery");
    return { id: result.insertId, title, imageUrl };
  } catch (e: any) {
    console.error("Upload Error:", e);
    return { error: "Failed to upload gallery image." };
  }
}

/**
 * DELETE: Removes record from MySQL and file from disk
 */
export async function deleteGalleryImage(id: number) {
  try {
    // 1. Get the URL first to delete the file
    const [rows]: any = await pool.query("SELECT image_url FROM gallery_images WHERE id = ?", [id]);
    if (rows.length === 0) return { error: "Image not found" };

    const imageUrl = rows[0].image_url;

    // 2. Delete from DB
    await pool.query("DELETE FROM gallery_images WHERE id = ?", [id]);

    // 3. Delete from Disk
    await deleteLocalFile(imageUrl);

    revalidatePath("/gallery");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * READ: Get all images
 */
export async function getAllGalleryImages() {
  try {
    const [rows] = await pool.query("SELECT * FROM gallery_images ORDER BY created_at DESC");
    return rows;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * UPDATE: Edit Title
 */
export async function editGalleryImage(id: number, formData: FormData) {
  try {
    const newTitle = formData.get('title') as string;

    const [result]: any = await pool.query(
      "UPDATE gallery_images SET title = ? WHERE id = ?",
      [newTitle, id]
    );

    if (result.affectedRows === 0) return { error: "Not found" };

    revalidatePath("/gallery");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}