import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import {
  adminProductsQuerySchema,
  createProductSchema,
} from "@/validations/admin-product.schema";
import { successResponse, errorResponse } from "@/lib/api-response";
import { assertSuperAdmin } from "@/lib/auth/admin-guard";
import { logAuditEvent } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/products
 * List products for Super Admin with pagination, search, status, and category filters.
 */
export async function GET(req: NextRequest) {
  try {
    assertSuperAdmin(req);

    const { searchParams } = new URL(req.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = adminProductsQuerySchema.parse(rawParams);
    const result = await productService.adminGetProducts(validatedQuery);

    return successResponse(result.items, "Admin products retrieved successfully", {
      pagination: result.pagination,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/admin/products
 * Create a new product with full variants, inventory, and school associations.
 */
export async function POST(req: NextRequest) {
  try {
    assertSuperAdmin(req);

    const body = await req.json();
    const validatedData = createProductSchema.parse(body);

    const product = await productService.createProduct(validatedData);

    await logAuditEvent({
      action: "PRODUCT_CREATE",
      module: "PRODUCTS",
      feature: "CATALOG_MANAGEMENT",
      details: {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        mrp: Number(product.mrp),
        sellingPrice: Number(product.sellingPrice),
      },
      req,
    });

    return successResponse(product, "Product created successfully", undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
