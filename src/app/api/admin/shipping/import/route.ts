import { NextRequest } from "next/server";
import { shippingRepository } from "@/repositories/shipping.repository";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bulkImportSchema = z.object({
  csvContent: z.string().min(1, "CSV content is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvContent } = bulkImportSchema.parse(body);

    const lines = csvContent
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      throw new Error("Empty CSV content");
    }

    // Header parsing: pincode,zone_code,serviceable,cod,min_days,max_days,city,state
    const headers = lines[0].toLowerCase().split(",").map((h) => h.trim());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      if (parts.length < 2) continue;

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx] || "";
      });

      const pin = row["pincode"] || parts[0];
      const zoneCode = row["zone_code"] || row["zone"] || parts[1] || "ZONE_NATIONAL";
      const serviceable = row["serviceable"] ? row["serviceable"].toLowerCase() === "true" || row["serviceable"] === "1" : true;
      const cod = row["cod"] ? row["cod"].toLowerCase() === "true" || row["cod"] === "1" : null;
      const minDays = row["min_days"] ? parseInt(row["min_days"], 10) : null;
      const maxDays = row["max_days"] ? parseInt(row["max_days"], 10) : null;
      const city = row["city"] || null;
      const state = row["state"] || null;

      if (/^[1-9][0-9]{5}$/.test(pin)) {
        records.push({
          pincode: pin,
          zoneCode,
          isServiceable: serviceable,
          isCodAvailable: cod,
          minDeliveryDays: minDays,
          maxDeliveryDays: maxDays,
          city,
          state,
        });
      }
    }

    const result = await shippingRepository.bulkImportPincodes(records);
    return successResponse(result, `Successfully processed ${result.imported} pincodes (${result.errors} errors)`);
  } catch (error) {
    return errorResponse(error);
  }
}
