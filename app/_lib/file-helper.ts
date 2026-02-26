// lib/file-helper.ts
import fs from "fs/promises";
import path from "path";

export async function saveLocalFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create unique filename
  const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  
  // Ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });
  
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  
  // Return the web-accessible URL path
  return `/uploads/${folder}/${filename}`;
}

export async function deleteLocalFile(fileUrl: string) {
  const filePath = path.join(process.cwd(), "public", fileUrl);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error("File deletion failed:", err);
  }
}