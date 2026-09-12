import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { updateProductSchema } from "@/validations/admin-product.schema";
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
 * GET /api/admin/products/[id]
 * Fetch single product details for Super Admin editing.
 */
export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    assertSuperAdmin(req);

    const product = await productService.adminGetProductById(params.id);
    return successResponse(product, "Product details retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PATCH /api/admin/products/[id]
 * Update product, images, variants, inventory, and school bindings.
 */
export async function PATCH(req: NextRequest, { params }: RouteProps) {
  try {
    assertSuperAdmin(req);

    const body = await req.json();
    const validatedData = updateProductSchema.parse(body);

    const product = await productService.updateProduct(params.id, validatedData);

    await logAuditEvent({
      action: "PRODUCT_UPDATE",
      module: "PRODUCTS",
      feature: "CATALOG_MANAGEMENT",
      details: {
        productId: product.id,
        name: product.name,
        updatedFields: Object.keys(validatedData),
      },
      req,
    });

    return successResponse(product, "Product updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PUT /api/admin/products/[id]
 * Alias for PATCH to support full product updates safely.
 */
export async function PUT(req: NextRequest, { params }: RouteProps) {
  return PATCH(req, { params });
}

/**
 * DELETE /api/admin/products/[id]
 * Archive / deactivate product (soft archive operation to preserve transactional integrity).
 */
export async function DELETE(req: NextRequest, { params }: RouteProps) {
  try {
    assertSuperAdmin(req);

    const product = await productService.archiveProduct(params.id);

    await logAuditEvent({
      action: "PRODUCT_ARCHIVE",
      module: "PRODUCTS",
      feature: "CATALOG_MANAGEMENT",
      details: {
        productId: product.id,
        name: product.name,
        status: product.status,
      },
      req,
    });

    return successResponse(product, "Product archived successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
