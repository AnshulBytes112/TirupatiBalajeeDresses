import { NextRequest } from "next/server";
import { homepageRepository } from "@/repositories/homepage.repository";
import { assertSuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/homepage
 * Protected Super-Admin endpoint to fetch complete homepage configuration
 */
export async function GET(req: NextRequest) {
  try {
    assertSuperAdmin(req);
    const data = await homepageRepository.getHomepageData();
    return successResponse(data, "Admin homepage data retrieved successfully");
  } catch (error: any) {
    return errorResponse(error);
  }
}

/**
 * PUT /api/admin/homepage
 * Protected Super-Admin endpoint to update homepage sections
 */
export async function PUT(req: NextRequest) {
  try {
    assertSuperAdmin(req);
    const body = await req.json();

    const updatedData = await homepageRepository.saveEntireHomepage(body);
    return successResponse(
      updatedData,
      "Homepage configuration saved and published successfully"
    );
  } catch (error: any) {
    return errorResponse(error);
  }
}
