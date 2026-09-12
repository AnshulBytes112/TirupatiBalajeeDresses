import { NextRequest } from "next/server";
import { requireCustomer } from "@/lib/auth/server-auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/account/orders
 * Retrieves all order history owned by the authenticated customer.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireCustomer();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 20), 50);

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true } },
                  },
                },
              },
            },
          },
        },
        address: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return successResponse(orders, "Orders retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
