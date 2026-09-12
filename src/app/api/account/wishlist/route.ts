import { NextRequest } from "next/server";
import { requireCustomer } from "@/lib/auth/server-auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError } from "@/lib/errors";

export const dynamic = "force-dynamic";

/**
 * GET /api/account/wishlist
 * Fetches all wishlist items for the authenticated customer.
 */
export async function GET(_req: NextRequest) {
  try {
    const user = await requireCustomer();

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
                category: { select: { name: true, slug: true } },
              },
            },
            variant: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: user.id },
        include: { items: true },
      }) as any;
    }

    return successResponse(wishlist?.items || [], "Wishlist retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/account/wishlist
 * Adds a product to the customer's wishlist.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireCustomer();
    const body = await req.json();
    const { productId, variantId } = body;

    if (!productId) {
      throw new BadRequestError("Product ID is required");
    }

    // Ensure wishlist exists
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: user.id },
      });
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId_variantId: {
          wishlistId: wishlist.id,
          productId,
          variantId: variantId || null,
        },
      },
      update: {},
      create: {
        wishlistId: wishlist.id,
        productId,
        variantId: variantId || null,
      },
    });

    return successResponse(item, "Item added to wishlist", undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * DELETE /api/account/wishlist
 * Removes an item from the customer's wishlist.
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireCustomer();
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");
    const productId = searchParams.get("productId");

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
    });

    if (!wishlist) {
      return successResponse({ deleted: true }, "Item removed from wishlist");
    }

    if (itemId) {
      await prisma.wishlistItem.deleteMany({
        where: {
          id: itemId,
          wishlistId: wishlist.id,
        },
      });
    } else if (productId) {
      await prisma.wishlistItem.deleteMany({
        where: {
          productId,
          wishlistId: wishlist.id,
        },
      });
    }

    return successResponse({ deleted: true }, "Item removed from wishlist");
  } catch (error) {
    return errorResponse(error);
  }
}
