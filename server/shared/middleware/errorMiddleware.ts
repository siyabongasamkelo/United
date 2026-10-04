import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// ❶ EXTEND NATIVE ERROR INTERFACE VIA A CUSTOM TYPE DEFINITION
// This cleanly tells TypeScript that our application errors can hold a status and details payload.
export interface CustomAppError extends Error {
  statusCode?: number;
  details?: any;
}

/**
 * 🚀 CUSTOM APPLICATION ERROR FACTORY
 * Replaces legacy OO class structures to prevent prototype compilation errors across modern environments.
 * Used inside your service layers to throw explicit business rejections (e.g., 404, 422, 403) [1.1].
 */
export const createAppError = (
  message: string,
  statusCode: number = 500,
  details: any = null,
): CustomAppError => {
  const error = new Error(message) as CustomAppError;
  error.statusCode = statusCode;
  error.details = details;
  return error;
};

// ❷ CENTRALIZED GLOBAL ERROR HANDLER INTERCEPTOR MIDDLEWARE
export const errorHandler = (
  err: CustomAppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const timestamp = new Date().toISOString();
  console.error(
    `[${timestamp}] ❌ CRITICAL OPERATION FAILED | Path: ${req.url}`,
  );
  console.error(`💥 Error Stack Trace:`, err.message || err);

  // 1. Handle Zod Parsing Schema Violations [1.1]
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Payload Validation Failed",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // 2. Handle Custom Domain Application Errors (Triggers when our statusCode property exists)
  if (err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
    return;
  }

  // 3. Handle Fallback Standard Server Exceptions
  res.status(500).json({
    success: false,
    error: "Internal Operational System Failure",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected server transaction error occurred.",
  });
};
