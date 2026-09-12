import { NextRequest } from "next/server";
import { requireCustomer } from "@/lib/auth/server-auth";
import { addressRepository } from "@/repositories/address.repository";
import { addressInputSchema } from "@/validations/address.schema";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/account/addresses
 * Retrieves all addresses owned by the authenticated customer.
 */
export async function GET(_req: NextRequest) {
  try {
    const user = await requireCustomer();
    const addresses = await addressRepository.findByUserId(user.id);
    return successResponse(addresses, "Addresses retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/account/addresses
 * Creates a new address for the authenticated customer.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireCustomer();
    const body = await req.json();
    const validated = addressInputSchema.parse(body);

    const address = await addressRepository.create(user.id, validated);
    return successResponse(address, "Address created successfully", undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
