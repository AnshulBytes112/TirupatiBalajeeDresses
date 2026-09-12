import { z } from "zod";

export const addressInputSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(70, "Full name too long"),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)"),
  addressLine1: z
    .string()
    .min(5, "Address line must be at least 5 characters")
    .max(150, "Address line too long"),
  addressLine2: z.string().max(150).optional().nullable(),
  landmark: z.string().max(100).optional().nullable(),
  city: z.string().min(2, "City name is required").max(60),
  state: z.string().min(2, "State name is required").max(60),
  postalCode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian PIN code (e.g. 110001)"),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = addressInputSchema.partial();

export type AddressInput = z.infer<typeof addressInputSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
