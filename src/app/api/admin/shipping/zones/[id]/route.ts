import { NextRequest } from "next/server";
import { shippingRepository } from "@/repositories/shipping.repository";
import { shippingZoneSchema } from "@/validations/delivery.schema";
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
    const zone = await shippingRepository.getZoneById(params.id);
    if (!zone) {
      throw new Error("Shipping zone not found");
    }
    return successResponse(zone, "Shipping zone retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  try {
    const body = await req.json();
    const validated = shippingZoneSchema.partial().parse(body);

    const updateData: Prisma.ShippingZoneUpdateInput = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.code !== undefined) updateData.code = validated.code;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.shippingCharge !== undefined) updateData.shippingCharge = new Prisma.Decimal(validated.shippingCharge);
    if (validated.freeShippingThreshold !== undefined) {
      updateData.freeShippingThreshold = validated.freeShippingThreshold !== null
        ? new Prisma.Decimal(validated.freeShippingThreshold)
        : null;
    }
    if (validated.minDeliveryDays !== undefined) updateData.minDeliveryDays = validated.minDeliveryDays;
    if (validated.maxDeliveryDays !== undefined) updateData.maxDeliveryDays = validated.maxDeliveryDays;
    if (validated.isCodAvailable !== undefined) updateData.isCodAvailable = validated.isCodAvailable;
    if (validated.dispatchSla !== undefined) updateData.dispatchSla = validated.dispatchSla;
    if (validated.isActive !== undefined) updateData.isActive = validated.isActive;

    const updated = await shippingRepository.updateZone(params.id, updateData);
    return successResponse(updated, "Shipping zone updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  return PUT(req, { params });
}

export async function DELETE(_req: NextRequest, { params }: RouteProps) {
  try {
    await shippingRepository.deleteZone(params.id);
    return successResponse({ deleted: true }, "Shipping zone deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
