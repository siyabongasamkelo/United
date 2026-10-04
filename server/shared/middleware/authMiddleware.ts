import { Request, Response, NextFunction } from "express";
import { createAppError } from "../../shared/middleware/errorMiddleware";

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionClaims?: {
      metadata?: {
        role?: "PORTER" | "SUPERVISOR" | "AREA_MANAGER" | "SYSTEM_ADMIN";
      };
    };
  };
}

export const requireSupervisor = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const userRole = req.auth?.sessionClaims?.metadata?.role;

  const hasAdminPrivileges =
    userRole === "SUPERVISOR" ||
    userRole === "AREA_MANAGER" ||
    userRole === "SYSTEM_ADMIN";

  if (!hasAdminPrivileges) {
    // ✅ Uses the clean factory function to throw the operational error smoothly!
    throw createAppError(
      "Access Denied. This administrative operation is restricted to Supervisor personnel only.",
      403,
    );
  }

  next();
};
