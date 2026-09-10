import { NextRequest } from "next/server";
import { shippingRepository } from "@/repositories/shipping.repository";
import { shippingPincodeSchema } from "@/validations/delivery.schema";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 50);
    const search = searchParams.get("search") || undefined;
    const zoneId = searchParams.get("zoneId") || undefined;

    const result = await shippingRepository.getPincodes(page, limit, search, zoneId);
    return successResponse(result, "Pincodes retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = shippingPincodeSchema.parse(body);

    const pincode = await shippingRepository.upsertPincode(validated);
    return successResponse(pincode, "Pincode saved successfully", undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("Pincode ID is required");

    await shippingRepository.deletePincode(id);
    return successResponse({ deleted: true }, "Pincode deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
