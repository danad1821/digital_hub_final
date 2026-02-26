"use server";

import pool from "@/app/_lib/db"; //
import { saveLocalFile, deleteLocalFile } from "@/app/_lib/file-helper";
import { revalidatePath } from "next/cache";

// ---------------------------
// --- READ (GET) ACTIONS ---
// ---------------------------

/**
 * Retrieves page content. 
 * Note: MariaDB/MySQL returns the 'sections' column as a parsed JSON object/array 
 * if using the mysql2 driver with modern versions.
 */
export async function getStaticPageContent(slug: string) {
  try {
    const [rows]: any = await pool.query("SELECT * FROM pages WHERE slug = ?", [slug]);
    if (rows.length === 0) return null;

    const page = rows[0];
    // Safety check: ensure sections is an object (mysql2 usually handles this)
    if (typeof page.sections === 'string') {
        page.sections = JSON.parse(page.sections);
    }
    return page;
  } catch (error) {
    console.error(`Error fetching page slug '${slug}':`, error);
    return null;
  }
}

export async function getHomePageContent() {
  return getStaticPageContent('home');
}

// ---------------------------
// --- UPDATE (PATCH) ACTIONS ---
// ---------------------------

/**
 * Updates basic page info (Title/Content)
 */
export async function updateStaticPageContent(
  slug: string,
  title: string
) {
  try {
    await pool.query(
      "UPDATE pages SET page_title = ?, last_updated = NOW() WHERE slug = ?",
      [title, slug]
    );
    revalidatePath(`/${slug}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ---------------------------
// --- SECTION IMAGE ACTIONS ---
// ---------------------------

/**
 * Specifically updates an image within the sections JSON array.
 * Example: Updates the "image_ref" inside the "hero" section.
 */
export async function updatePageSectionImage(
  slug: string,
  sectionType: string,
  formData: FormData
) {
  try {
    const imageFile = formData.get('image') as File;
    if (!imageFile) return { success: false, error: "No image file provided." };

    // 1. Fetch current sections
    const [rows]: any = await pool.query("SELECT sections FROM pages WHERE slug = ?", [slug]);
    if (rows.length === 0) return { success: false, error: "Page not found." };

    let sections = typeof rows[0].sections === 'string' 
        ? JSON.parse(rows[0].sections) 
        : rows[0].sections;

    // 2. Find the correct section (e.g., 'hero' or 'stats')
    const sectionIndex = sections.findIndex((s: any) => s.type === sectionType);
    if (sectionIndex === -1) return { success: false, error: `Section ${sectionType} not found.` };

    const oldImageRef = sections[sectionIndex].data?.image_ref;

    // 3. Save the new local file
    const newImageUrl = await saveLocalFile(imageFile, "pages");

    // 4. Update the JSON structure
    // We replace the old hex/ID with the new path string: "/uploads/pages/filename.jpg"
    if (!sections[sectionIndex].data) sections[sectionIndex].data = {};
    sections[sectionIndex].data.image_ref = newImageUrl;

    // 5. Save back to MariaDB
    await pool.query(
      "UPDATE pages SET sections = ?, last_updated = NOW() WHERE slug = ?",
      [JSON.stringify(sections), slug]
    );

    // 6. Cleanup old local file if it was a path (not an old Mongo hex ID)
    if (oldImageRef && oldImageRef.startsWith('/uploads/')) {
        await deleteLocalFile(oldImageRef);
    }

    revalidatePath(slug === 'home' ? '/' : `/${slug}`);
    return { success: true, newImageUrl };
  } catch (e: any) {
    console.error("Section Image Update Error:", e);
    return { success: false, error: e.message };
  }
}

/**
 * General update for all sections (useful for the Admin JSON editor)
 */
export async function updateAllPageSections(slug: string, sections: any[]) {
    try {
        await pool.query(
            "UPDATE pages SET sections = ?, last_updated = NOW() WHERE slug = ?",
            [JSON.stringify(sections), slug]
        );
        revalidatePath(slug === 'home' ? '/' : `/${slug}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// Example: @/app/_lib/api-utils.ts or wherever ImageEditor imports from

import axios from 'axios';

/**
 * Deletes a specific image associated with a page section
 */
export const deletePageImageByFileId = async (slug: string, sectionIndex: number) => {
  try {
    // This calls your API route to remove the image_ref from the database
    const response = await axios.delete(`/api/pages/${slug}/image`, {
      data: { sectionIndex }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete image:", error);
    throw error;
  }
};