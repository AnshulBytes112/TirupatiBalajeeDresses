import { NextRequest } from "next/server";
import { shippingRepository } from "@/repositories/shipping.repository";
import { shippingPincodeSchema } from "@/validations/delivery.schema";
import { successResponse, errorResponse } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: {
    id: string;
  };
}

export async function GET(_req: NextRequest, { params }: RouteProps) {
  try {
    const pincode = await shippingRepository.getPincodeById(params.id);
    if (!pincode) {
      throw new Error("Pincode rule not found");
    }
    return successResponse(pincode, "Pincode retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  try {
    const body = await req.json();
    const validated = shippingPincodeSchema.partial().parse(body);

    const updateData: Prisma.ShippingPincodeUpdateInput = {};
    if (validated.pincode !== undefined) updateData.pincode = validated.pincode;
    if (validated.zoneId !== undefined) {
      updateData.zone = { connect: { id: validated.zoneId } };
    }
    if (validated.city !== undefined) updateData.city = validated.city;
    if (validated.state !== undefined) updateData.state = validated.state;
    if (validated.isServiceable !== undefined) updateData.isServiceable = validated.isServiceable;
    if (validated.isCodAvailable !== undefined) updateData.isCodAvailable = validated.isCodAvailable;
    if (validated.minDeliveryDays !== undefined) updateData.minDeliveryDays = validated.minDeliveryDays;
    if (validated.maxDeliveryDays !== undefined) updateData.maxDeliveryDays = validated.maxDeliveryDays;
    if (validated.isActive !== undefined) updateData.isActive = validated.isActive;

    const updated = await shippingRepository.updatePincode(params.id, updateData);
    return successResponse(updated, "Pincode updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  return PUT(req, { params });
}

export async function DELETE(_req: NextRequest, { params }: RouteProps) {
  try {
    await shippingRepository.deletePincode(params.id);
    return successResponse({ deleted: true }, "Pincode deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
