import { NextRequest } from "next/server";
import { homepageRepository } from "@/repositories/homepage.repository";
import { assertSuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logAuditEvent } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/homepage
 * Protected Super-Admin endpoint to fetch complete homepage configuration
 */
export async function GET(req: NextRequest) {
  try {
    assertSuperAdmin(req);
    const data = await homepageRepository.getHomepageData();

    await logAuditEvent({
      action: "PAGE_VISIT",
      module: "HOMEPAGE",
      feature: "CMS_DRAFT_VIEW",
      details: {
        heroSlidesCount: data.heroSlides?.length || 0,
        categoryCardsCount: data.categoryCards?.length || 0,
      },
      req,
    });

    return successResponse(data, "Admin homepage data retrieved successfully");
  } catch (error: any) {
    await logAuditEvent({
      action: "UNAUTHORIZED_HOMEPAGE_ACCESS",
      module: "HOMEPAGE",
      status: "DENIED",
      req,
    });
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

    await logAuditEvent({
      action: "HOMEPAGE_PUBLISH",
      module: "HOMEPAGE",
      feature: "LIVE_STOREFRONT_SYNC",
      details: {
        publishedSections: Object.keys(body),
        heroCount: body.heroSlides?.length,
        categoryCount: body.categoryCards?.length,
        promoSplitCount: body.promoSplitCards?.length,
        promoComboCount: body.promoComboCards?.length,
        trendingProductsCount: body.trendingProducts?.length,
      },
      req,
    });

    return successResponse(
      updatedData,
      "Homepage configuration saved and published successfully"
    );
  } catch (error: any) {
    return errorResponse(error);
  }
}
