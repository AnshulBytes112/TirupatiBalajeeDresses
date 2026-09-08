import { successResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  return successResponse(
    {
      status: "healthy",
      service: "TirupatiBalajee Dresses API",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    "TirupatiBalajee Dresses System is operational"
  );
}
