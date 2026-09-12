import { NextRequest } from "next/server";
import { requireCustomer } from "@/lib/auth/server-auth";
import { addressRepository } from "@/repositories/address.repository";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: {
    id: string;
  };
}

/**
 * POST /api/account/addresses/[id]/default
 * Atomically marks address [id] as default and unsets all other defaults for this customer.
 */
export async function POST(_req: NextRequest, { params }: RouteProps) {
  try {
    const user = await requireCustomer();
    const updated = await addressRepository.setDefault(params.id, user.id);
    return successResponse(updated, "Default shipping address updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
