import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { assertSuperAdmin } from "@/lib/auth/admin-guard";
import { logAuditEvent } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: {
    id: string;
  };
}

/**
 * POST /api/admin/products/[id]/restore
 * Restore an archived product back to published state.
 */
export async function POST(req: NextRequest, { params }: RouteProps) {
  try {
    assertSuperAdmin(req);

    const product = await productService.restoreProduct(params.id);

    await logAuditEvent({
      action: "PRODUCT_RESTORE",
      module: "PRODUCTS",
      feature: "CATALOG_MANAGEMENT",
      details: {
        productId: product.id,
        name: product.name,
      },
      req,
    });

    return successResponse(product, "Product restored successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
