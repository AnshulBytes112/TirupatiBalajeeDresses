import { NextResponse } from "next/server";
import { AppError } from "./errors";
import { logger } from "./logger";

export function successResponse<T>(data: T, message?: string, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      meta,
    },
    { status }
  );
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    logger.warn(`Operational Error: ${error.message}`, {
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  logger.error("Unhandled Server Error", { error: String(error) });

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
    },
    { status: 500 }
  );
}
