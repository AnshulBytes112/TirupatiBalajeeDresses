import { NextRequest } from "next/server";
import { requireCustomer } from "@/lib/auth/server-auth";
import { addressRepository } from "@/repositories/address.repository";
import { updateAddressSchema } from "@/validations/address.schema";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: {
    id: string;
  };
}

/**
 * GET /api/account/addresses/[id]
 */
export async function GET(_req: NextRequest, { params }: RouteProps) {
  try {
    const user = await requireCustomer();
    const address = await addressRepository.findByIdAndUserId(params.id, user.id);
    if (!address) {
      throw new NotFoundError("Address not found or unauthorized");
    }
    return successResponse(address, "Address retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PUT /api/account/addresses/[id]
 */
export async function PUT(req: NextRequest, { params }: RouteProps) {
  try {
    const user = await requireCustomer();
    const body = await req.json();
    const validated = updateAddressSchema.parse(body);

    const updated = await addressRepository.update(params.id, user.id, validated);
    return successResponse(updated, "Address updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  return PUT(req, { params });
}

/**
 * DELETE /api/account/addresses/[id]
 */
export async function DELETE(_req: NextRequest, { params }: RouteProps) {
  try {
    const user = await requireCustomer();
    await addressRepository.delete(params.id, user.id);
    return successResponse({ deleted: true }, "Address deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
