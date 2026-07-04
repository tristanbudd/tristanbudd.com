import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Helper to check admin session
function isAuthorized(request: NextRequest): boolean {
  const adminSession = request.cookies.get("admin_session")?.value;
  const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";
  return adminSession === ownerAccount;
}

// GET: List all uploaded images
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    // Ensure the uploads directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
    }

    const files = await fs.promises.readdir(UPLOAD_DIR);
    const imagesData = [];

    for (const filename of files) {
      const filePath = path.join(UPLOAD_DIR, filename);
      const stat = await fs.promises.stat(filePath);

      // Check if it is a file (exclude directories just in case)
      if (stat.isFile()) {
        const ext = path.extname(filename).toLowerCase();
        // Simple client-side validation fallback check
        const isImage = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext);

        if (isImage) {
          imagesData.push({
            name: filename,
            size: stat.size,
            createdAt: stat.mtime.toISOString(),
            url: `/uploads/${filename}`,
          });
        }
      }
    }

    // Sort images by creation/modification date desc (latest first)
    imagesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(imagesData);
  } catch (error) {
    console.error("GET /api/admin/images error:", error);
    return NextResponse.json({ error: "Failed to list images." }, { status: 500 });
  }
}

// POST: Upload an image securely
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // File validation: Size limit (5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // File validation: Content Type (MIME Type)
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPEG, GIF, WebP, and SVG images are allowed." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Sanitize and create collision-resistant filename
    const originalExt = path.extname(file.name).toLowerCase();
    const originalBaseName = path.basename(file.name, originalExt);
    const sanitizedBase = originalBaseName
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-") // Replace non-alphanumeric with dashes
      .replace(/-+/g, "-") // Collapse multiple dashes
      .replace(/^-|-$/g, ""); // Strip leading/trailing dashes

    const timestamp = Date.now();
    const finalFilename = `${sanitizedBase}_${timestamp}${originalExt}`;
    const targetPath = path.join(UPLOAD_DIR, finalFilename);

    // Save to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(targetPath, buffer);

    return NextResponse.json({
      name: finalFilename,
      size: file.size,
      createdAt: new Date().toISOString(),
      url: `/uploads/${finalFilename}`,
    });
  } catch (error) {
    console.error("POST /api/admin/images error:", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}

// DELETE: Delete an image securely
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Filename is required." }, { status: 400 });
    }

    // Security check: Prevent Directory Traversal
    // Check if filename contains paths like "..", "/", or "\"
    if (name.includes("..") || name.includes("/") || name.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename parameter." }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, name);

    // Verify file exists before deleting
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    // Delete the file
    await fs.promises.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/images error:", error);
    return NextResponse.json({ error: "Failed to delete image." }, { status: 500 });
  }
}
