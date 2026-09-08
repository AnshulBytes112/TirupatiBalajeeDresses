import { NextRequest } from "next/server";
import { homepageRepository } from "@/repositories/homepage.repository";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/homepage
 * Public endpoint to fetch all active dynamic homepage content
 */
export async function GET(req: NextRequest) {
  try {
    const data = await homepageRepository.getHomepageData();
    return successResponse(data, "Homepage data retrieved successfully");
  } catch (error: any) {
    return errorResponse(error);
  }
}
