import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertSuperAdmin } from "@/lib/auth/admin-guard";
import { logAuditEvent } from "@/lib/audit/audit-logger";
import { successResponse, errorResponse } from "@/lib/api-response";
import { parseCsv } from "@/lib/csv-parser";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    assertSuperAdmin(req);

    const body = await req.json();
    let rawRows: any[] = [];

    if (body.csvContent && typeof body.csvContent === "string") {
      rawRows = parseCsv(body.csvContent);
    } else if (Array.isArray(body.rows)) {
      rawRows = body.rows;
    } else {
      return errorResponse(new Error("Either 'csvContent' string or 'rows' array is required."));
    }

    if (rawRows.length === 0) {
      return errorResponse(new Error("No valid rows found in CSV data."));
    }

    let createdCount = 0;
    let updatedCount = 0;
    const errors: Array<{ row: number; name?: string; error: string }> = [];
    const processed: Array<{ name: string; slug: string; action: "created" | "updated" }> = [];

    // Helper to get normalized value from row
    const getVal = (row: any, ...keys: string[]): string => {
      for (const k of keys) {
        const norm = k.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (row[norm] !== undefined && row[norm] !== "") {
          return String(row[norm]).trim();
        }
        if (row[k] !== undefined && row[k] !== "") {
          return String(row[k]).trim();
        }
      }
      return "";
    };

    // Cache categories map by slug & name
    const existingCats = await prisma.category.findMany();
    const slugMap = new Map<string, string>(); // slug -> id
    const nameMap = new Map<string, string>(); // lowercase name -> id

    for (const c of existingCats) {
      slugMap.set(c.slug, c.id);
      nameMap.set(c.name.toLowerCase(), c.id);
    }

    // Process top-level first, then child categories (or 2-pass approach)
    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const rowNumber = i + 2; // 1-based + 1 header row

      const name = getVal(row, "name", "categoryName", "title");
      if (!name) {
        errors.push({ row: rowNumber, error: "Category 'name' is required." });
        continue;
      }

      const explicitSlug = getVal(row, "slug", "categorySlug");
      const slug = explicitSlug ? slugify(explicitSlug) : slugify(name);
      const parentSlug = getVal(row, "parentSlug", "parent", "parentCategory", "parentName");
      const description = getVal(row, "description", "desc");
      const imageUrl = getVal(row, "imageUrl", "image", "photo", "img");
      const displayOrderRaw = getVal(row, "displayOrder", "order", "sortOrder");
      const displayOrder = displayOrderRaw ? parseInt(displayOrderRaw, 10) || 0 : 0;
      const isActiveRaw = getVal(row, "isActive", "active", "status");
      const isActive = isActiveRaw === "" ? true : isActiveRaw.toLowerCase() !== "false" && isActiveRaw !== "0";

      try {
        // Resolve parent ID if provided
        let parentId: string | null = null;
        if (parentSlug) {
          const normParent = slugify(parentSlug);
          if (slugMap.has(normParent)) {
            parentId = slugMap.get(normParent)!;
          } else if (nameMap.has(parentSlug.toLowerCase())) {
            parentId = nameMap.get(parentSlug.toLowerCase())!;
          } else {
            // Check if parent category exists in DB
            const parentInDb = await prisma.category.findFirst({
              where: {
                OR: [
                  { slug: normParent },
                  { name: { equals: parentSlug, mode: "insensitive" } },
                ],
              },
            });
            if (parentInDb) {
              parentId = parentInDb.id;
              slugMap.set(parentInDb.slug, parentInDb.id);
              nameMap.set(parentInDb.name.toLowerCase(), parentInDb.id);
            }
          }
        }

        // Upsert Category
        const existingId = slugMap.get(slug);

        if (existingId) {
          // Update
          const updated = await prisma.category.update({
            where: { id: existingId },
            data: {
              name,
              description: description || undefined,
              imageUrl: imageUrl || undefined,
              parentId: parentId !== undefined ? parentId : undefined,
              displayOrder,
              isActive,
            },
          });
          slugMap.set(updated.slug, updated.id);
          nameMap.set(updated.name.toLowerCase(), updated.id);
          updatedCount++;
          processed.push({ name: updated.name, slug: updated.slug, action: "updated" });
        } else {
          // Check DB directly in case
          const existingInDb = await prisma.category.findUnique({ where: { slug } });
          if (existingInDb) {
            const updated = await prisma.category.update({
              where: { id: existingInDb.id },
              data: {
                name,
                description: description || undefined,
                imageUrl: imageUrl || undefined,
                parentId: parentId !== undefined ? parentId : undefined,
                displayOrder,
                isActive,
              },
            });
            slugMap.set(updated.slug, updated.id);
            nameMap.set(updated.name.toLowerCase(), updated.id);
            updatedCount++;
            processed.push({ name: updated.name, slug: updated.slug, action: "updated" });
          } else {
            // Create
            const created = await prisma.category.create({
              data: {
                name,
                slug,
                description: description || null,
                imageUrl: imageUrl || null,
                parentId: parentId || null,
                displayOrder,
                isActive,
              },
            });
            slugMap.set(created.slug, created.id);
            nameMap.set(created.name.toLowerCase(), created.id);
            createdCount++;
            processed.push({ name: created.name, slug: created.slug, action: "created" });
          }
        }
      } catch (err: any) {
        errors.push({
          row: rowNumber,
          name,
          error: err?.message || "Failed to process category row.",
        });
      }
    }

    // Audit Log
    await logAuditEvent({
      action: "CATEGORY_BULK_IMPORT",
      module: "CATEGORIES",
      feature: "BULK_IMPORT",
      details: {
        totalRows: rawRows.length,
        createdCount,
        updatedCount,
        errorCount: errors.length,
      },
      req,
    });

    return successResponse(
      {
        totalRows: rawRows.length,
        createdCount,
        updatedCount,
        errorCount: errors.length,
        errors,
        processed,
      },
      `Bulk category import completed: ${createdCount} created, ${updatedCount} updated, ${errors.length} failed.`
    );
  } catch (error) {
    return errorResponse(error);
  }
}
