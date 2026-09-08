import { NextRequest } from "next/server";
import { homepageRepository } from "@/repositories/homepage.repository";
import { assertSuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    sectionKey: string;
  };
}

/**
 * PUT /api/admin/homepage/[sectionKey]
 * Super-Admin endpoint to update a specific section (e.g. "hero_carousel", "category_grid", "promo_split")
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    assertSuperAdmin(req);
    const { sectionKey } = params;
    const body = await req.json();

    const updated = await homepageRepository.updateSection(
      sectionKey,
      body.content ?? body,
      {
        title: body.title,
        subtitle: body.subtitle,
        badge: body.badge,
        displayOrder: body.displayOrder,
      }
    );

    return successResponse(
      updated,
      `Section '${sectionKey}' updated successfully`
    );
  } catch (error: any) {
    return errorResponse(error);
  }
}
