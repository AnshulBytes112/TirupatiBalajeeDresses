import { NextRequest } from "next/server";
import { schoolService } from "@/services/school.service";
import { verifySuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { UnauthorizedError } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit/audit-logger";
import { Gender, Season } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/schools/bindings
 * Fetch school uniform bindings
 */
export async function GET(req: NextRequest) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId") || undefined;
    const productId = searchParams.get("productId") || undefined;
    const season = (searchParams.get("season") as Season) || undefined;
    const gender = (searchParams.get("gender") as Gender) || undefined;

    const bindings = await schoolService.getBindings({
      schoolId,
      productId,
      season,
      gender,
    });

    return successResponse(bindings, "School bindings retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/admin/schools/bindings
 * Create / bind a uniform to a school
 */
export async function POST(req: NextRequest) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const body = await req.json();
    const binding = await schoolService.createBinding(body);

    await logAuditEvent({
      action: "SCHOOL_BINDING_CREATE",
      module: "CATALOG",
      feature: "SCHOOL_UNIFORM_BINDINGS",
      details: {
        schoolId: body.schoolId,
        productId: body.productId,
        season: body.season,
        gender: body.gender,
        classGrade: body.classGrade,
      },
      req,
    });

    return successResponse(binding, "Uniform bound to school successfully", undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
