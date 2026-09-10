import { shippingRepository } from "@/repositories/shipping.repository";
import { DeliveryCheckInput } from "@/validations/delivery.schema";
import { prisma } from "@/lib/prisma";

export interface DeliveryCheckResult {
  pincode: string;
  isServiceable: boolean;
  city: string | null;
  state: string | null;
  zoneName: string;
  zoneCode: string;
  shippingCharge: number;
  freeShippingThreshold: number | null;
  isFreeShipping: boolean;
  isCodAvailable: boolean;
  dispatchEstimate: string;
  deliveryEstimate: string;
  estimatedDeliveryDateFormatted: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

export class DeliveryService {
  /**
   * Helper to calculate estimated business days from a given start date
   * Business days skip Sundays.
   */
  private addBusinessDays(startDate: Date, daysToAdd: number): Date {
    const result = new Date(startDate);
    let added = 0;
    while (added < daysToAdd) {
      result.setDate(result.getDate() + 1);
      // Sunday is 0 in JS Date
      if (result.getDay() !== 0) {
        added++;
      }
    }
    return result;
  }

  private formatDate(date: Date): string {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  }

  async checkDelivery(input: DeliveryCheckInput): Promise<DeliveryCheckResult> {
    const { pincode, productId, variantId, quantity = 1 } = input;

    // Validate pincode format
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      throw new Error("Invalid 6-digit Indian Postal Code");
    }

    // Lookup rule
    const rule = await shippingRepository.findPincodeWithZone(pincode);

    if (!rule || !rule.isServiceable || !rule.zone || !rule.zone.isActive) {
      return {
        pincode,
        isServiceable: false,
        city: rule?.city || null,
        state: rule?.state || null,
        zoneName: rule?.zone?.name || "Unknown Zone",
        zoneCode: rule?.zone?.code || "UNSERVICEABLE",
        shippingCharge: 0,
        freeShippingThreshold: null,
        isFreeShipping: false,
        isCodAvailable: false,
        dispatchEstimate: "Unavailable",
        deliveryEstimate: "Delivery not available to this PIN code",
        estimatedDeliveryDateFormatted: "Unavailable",
        minDeliveryDays: 0,
        maxDeliveryDays: 0,
      };
    }

    const zone = rule.zone;
    const minDays = rule.minDeliveryDays ?? zone.minDeliveryDays ?? 2;
    const maxDays = rule.maxDeliveryDays ?? zone.maxDeliveryDays ?? 5;
    const isCod = rule.isCodAvailable !== null && rule.isCodAvailable !== undefined
      ? rule.isCodAvailable
      : zone.isCodAvailable;

    const baseCharge = Number(zone.shippingCharge);
    const freeThreshold = zone.freeShippingThreshold ? Number(zone.freeShippingThreshold) : null;

    // Check product price if provided to test free shipping threshold
    let orderAmount = 0;
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { sellingPrice: true },
      });
      if (variant) {
        orderAmount = Number(variant.sellingPrice) * quantity;
      }
    } else if (productId) {
      const prod = await prisma.product.findUnique({
        where: { id: productId },
        select: { sellingPrice: true },
      });
      if (prod) {
        orderAmount = Number(prod.sellingPrice) * quantity;
      }
    }

    const isFreeShipping = freeThreshold !== null && orderAmount >= freeThreshold;
    const finalShippingCharge = isFreeShipping ? 0 : baseCharge;

    // Compute business delivery dates
    const now = new Date();
    const minDeliveryDate = this.addBusinessDays(now, minDays);
    const maxDeliveryDate = this.addBusinessDays(now, maxDays);

    const minFormatted = this.formatDate(minDeliveryDate);
    const maxFormatted = this.formatDate(maxDeliveryDate);

    const deliveryEstimate = minDays === maxDays
      ? `Delivery by ${minFormatted}`
      : `Delivery between ${minFormatted} - ${maxFormatted}`;

    return {
      pincode,
      isServiceable: true,
      city: rule.city,
      state: rule.state,
      zoneName: zone.name,
      zoneCode: zone.code,
      shippingCharge: finalShippingCharge,
      freeShippingThreshold: freeThreshold,
      isFreeShipping,
      isCodAvailable: isCod,
      dispatchEstimate: zone.dispatchSla || "Dispatched in 24 hours",
      deliveryEstimate,
      estimatedDeliveryDateFormatted: `${minFormatted} - ${maxFormatted}`,
      minDeliveryDays: minDays,
      maxDeliveryDays: maxDays,
    };
  }
}

export const deliveryService = new DeliveryService();
