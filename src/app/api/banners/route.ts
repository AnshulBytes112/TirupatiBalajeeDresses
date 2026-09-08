import { NextRequest } from "next/server";
import { bannerService } from "@/services/banner.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BannerPosition } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position") as BannerPosition | undefined;

    const banners = await bannerService.getBanners(position);
    return successResponse(banners, "Banners retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
