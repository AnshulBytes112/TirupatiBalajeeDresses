import { NextRequest } from "next/server";
import { requireCustomer } from "@/lib/auth/server-auth";
import { userRepository } from "@/repositories/user.repository";
import { updateProfileSchema } from "@/validations/auth.schema";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/account/profile
 * Retrieves authenticated customer profile and statistics.
 */
export async function GET(_req: NextRequest) {
  try {
    const user = await requireCustomer();
    const profileWithStats = await userRepository.getProfileWithStats(user.id);
    return successResponse(profileWithStats, "Profile retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PATCH /api/account/profile
 * Updates authenticated customer name or phone. Email identity remains managed by Supabase.
 */
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireCustomer();
    const body = await req.json();
    const validated = updateProfileSchema.parse(body);

    const updated = await userRepository.updateProfile(user.id, {
      name: validated.name,
      phone: validated.phone,
    });

    return successResponse(updated, "Profile updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
