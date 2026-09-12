import { z } from "zod";

export const emailOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  token: z.string().min(6, "OTP code must be at least 6 digits").max(10),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name too long"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
    .optional()
    .nullable(),
});

export type EmailOtpInput = z.infer<typeof emailOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
