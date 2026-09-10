import { NextRequest } from "next/server";
import { deliveryService } from "@/services/delivery.service";
import { deliveryCheckSchema } from "@/validations/delivery.schema";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = deliveryCheckSchema.parse(body);

    const result = await deliveryService.checkDelivery(validatedData);
    return successResponse(result, "Delivery check completed successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
