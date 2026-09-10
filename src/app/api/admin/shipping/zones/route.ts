import { NextRequest } from "next/server";
import { shippingRepository } from "@/repositories/shipping.repository";
import { shippingZoneSchema } from "@/validations/delivery.schema";
import { successResponse, errorResponse } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const zones = await shippingRepository.getAllZones();
    return successResponse(zones, "Shipping zones retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = shippingZoneSchema.parse(body);

    const zone = await shippingRepository.createZone({
      name: validated.name,
      code: validated.code,
      description: validated.description,
      shippingCharge: new Prisma.Decimal(validated.shippingCharge),
      freeShippingThreshold: validated.freeShippingThreshold !== null && validated.freeShippingThreshold !== undefined
        ? new Prisma.Decimal(validated.freeShippingThreshold)
        : null,
      minDeliveryDays: validated.minDeliveryDays,
      maxDeliveryDays: validated.maxDeliveryDays,
      isCodAvailable: validated.isCodAvailable,
      dispatchSla: validated.dispatchSla,
      isActive: validated.isActive,
    });

    return successResponse(zone, "Shipping zone created successfully", undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
