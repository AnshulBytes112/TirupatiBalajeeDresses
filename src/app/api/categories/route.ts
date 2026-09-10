import { NextRequest } from "next/server";
import { categoryService } from "@/services/category.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (format === "navigation") {
      const navItems = await categoryService.getNavigationCategories();
      return successResponse(navItems);
    }

    if (format === "flat") {
      const flatCategories = await categoryService.getAllCategoriesFlat();
      return successResponse(flatCategories);
    }

    const categories = await categoryService.getCategories();
    return successResponse(categories);
  } catch (error: unknown) {
    console.error("GET /api/categories error:", error);
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return errorResponse(new BadRequestError("Category name is required"));
    }

    const category = await categoryService.createCategory(body);
    return successResponse(category, "Category created successfully", undefined, 201);
  } catch (error: unknown) {
    console.error("POST /api/categories error:", error);
    return errorResponse(error);
  }
}

