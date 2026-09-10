import { z } from "zod";

export const deliveryCheckSchema = z.object({
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian PIN code"),
  productId: z.string().optional(),
  variantId: z.string().optional(),
  quantity: z.coerce.number().min(1).default(1),
});

export type DeliveryCheckInput = z.infer<typeof deliveryCheckSchema>;

export const shippingZoneSchema = z.object({
  name: z.string().min(2, "Zone name must be at least 2 characters"),
  code: z.string().min(2, "Zone code must be at least 2 characters").toUpperCase(),
  description: z.string().optional(),
  shippingCharge: z.coerce.number().min(0, "Shipping charge must be >= 0"),
  freeShippingThreshold: z.coerce.number().min(0).optional().nullable(),
  minDeliveryDays: z.coerce.number().int().min(1, "Min days must be at least 1"),
  maxDeliveryDays: z.coerce.number().int().min(1, "Max days must be at least 1"),
  isCodAvailable: z.boolean().default(true),
  dispatchSla: z.string().default("Same Day Dispatch"),
  isActive: z.boolean().default(true),
});

export type ShippingZoneInput = z.infer<typeof shippingZoneSchema>;

export const shippingPincodeSchema = z.object({
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Pincode must be 6 digits"),
  zoneId: z.string().uuid("Invalid Zone ID"),
  isServiceable: z.boolean().default(true),
  isCodAvailable: z.boolean().optional().nullable(),
  minDeliveryDays: z.coerce.number().int().min(1).optional().nullable(),
  maxDeliveryDays: z.coerce.number().int().min(1).optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ShippingPincodeInput = z.infer<typeof shippingPincodeSchema>;
