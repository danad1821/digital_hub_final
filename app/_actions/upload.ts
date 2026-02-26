'use server'

import fs from "fs/promises";
import path from "path";

export interface UploadResult {
  success: boolean;
  fileId?: string; // This will now return the relative web path (e.g., /uploads/filename.jpg)
  error?: string;
}

/**
 * Saves an image to the local file system and returns the public URL path.
 * @param formData FormData containing the 'image' key.
 * @param subFolder Optional sub-directory (e.g., 'gallery', 'pages').
 */
export async function uploadImage(formData: FormData, subFolder: string = 'general'): Promise<UploadResult> {
  try {
    // 1. Extract and Validate
    const fileEntry = formData.get('image');
    if (!fileEntry || !(fileEntry instanceof File)) {
      return { success: false, error: 'No valid file uploaded' };
    }
    const file = fileEntry as File;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // Lowered to 10MB for typical web images
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File size exceeds 10MB limit.' };
    }

    // 2. Prepare File Path
    // Create a unique filename to prevent overwriting
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '_')}`;
    
    // Define the absolute path on the server
    const uploadDir = path.join(process.cwd(), "public", "uploads", subFolder);
    const filePath = path.join(uploadDir, filename);

    // 3. Ensure Directory Exists
    await fs.mkdir(uploadDir, { recursive: true });

    // 4. Write File to Disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // 5. Return the Relative URL Path
    // This is what you will store in your MariaDB 'image_url' or 'image_ref' columns
    const relativePath = `/uploads/${subFolder}/${filename}`;

    return { success: true, fileId: relativePath };
  } catch (error) {
    console.error("[Upload Error]:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    return { success: false, error: errorMessage };
  }
}