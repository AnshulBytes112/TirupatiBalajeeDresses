import { NextRequest } from "next/server";
import { assertSuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError } from "@/lib/errors";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/homepage/upload
 * Super-Admin endpoint to upload/replace banner, card, and hero photos
 */
export async function POST(req: NextRequest) {
  try {
    assertSuperAdmin(req);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directUrl = formData.get("url") as string | null;

    if (directUrl) {
      return successResponse(
        { url: directUrl },
        "Media URL registered successfully"
      );
    }

    if (!file) {
      throw new BadRequestError("No file or URL provided");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || ".jpg";
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const filename = `${cleanBase}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return successResponse(
      { url: publicUrl, filename },
      "Photo uploaded successfully"
    );
  } catch (error: any) {
    return errorResponse(error);
  }
}
