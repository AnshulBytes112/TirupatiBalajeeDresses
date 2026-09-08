import { envSchema, EnvConfig } from "@/validations/env.schema";

let validatedEnv: EnvConfig;

try {
  validatedEnv = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    LOG_LEVEL: process.env.LOG_LEVEL,
  });
} catch (error) {
  // During build / initial setup if env is not completely filled, fallback gracefully for client builds
  validatedEnv = {
    NODE_ENV: (process.env.NODE_ENV as "development" | "test" | "production") || "development",
    PORT: process.env.PORT || "3000",
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/tirupati_balaji_dresses",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    LOG_LEVEL: "info",
  };
}

export const env = validatedEnv;
