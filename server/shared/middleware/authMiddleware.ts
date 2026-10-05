import { Request, Response, NextFunction } from "express";
import { createAppError } from "../../shared/middleware/errorMiddleware";
// 🔗 Leverage the Repository layer directly to maintain zero-model coupling rules!
import { UserRepository } from "../../features/users/repositories/UserRepository";
import { IUser } from "../../features/users/models/User";

// ❶ Expand the AuthenticatedRequest interface to support both Clerk metadata and our local database User document context
export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionClaims?: {
      metadata?: {
        role?: "PORTER" | "SUPERVISOR" | "AREA_MANAGER" | "SYSTEM_ADMIN";
      };
    };
  };
  // ⚡ This is where our freshly hydrated local MongoDB document index will live!
  user?: IUser;
}

/**
 * 🔒 SECURITY GATE: Hydrates raw Clerk identities with local MongoDB document references.
 * Placed immediately after Clerk's native validation engine across network routes.
 */
export const hydrateLocalUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      throw createAppError(
        "Authentication failed. No valid Clerk identity found on the request token pipeline.",
        401,
      );
    }

    // 🔍 Instantiate the data layer context to isolate raw Mongoose operations away
    const userRepo = new UserRepository();
    const localUser = await userRepo.getUserByClerkId(clerkId);

    // 🚨 If the user profile isn't synced into our local DB yet, reject early
    if (!localUser) {
      throw createAppError(
        `Operational profile synchronization missing. The identity "${clerkId}" must complete onboarding sync before performing system actions.`,
        404,
      );
    }

    // 🚫 Administrative Suspension Check: Block deactivated staff immediately at the perimeter
    if (!localUser.isActive) {
      throw createAppError(
        "Access Denied. This account has been administratively suspended from operational duties.",
        423,
      );
    }

    // 🔥 Hydration Success: Bind the complete local database profile index straight to the request!
    req.user = localUser;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 📊 ROLE PRIVILEGE CHECK: Restricts administrative routes to high-clearance personnel
 */
export const requireSupervisor = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  // We can now safely check the role directly from our pre-hydrated database user context,
  // or fall back to Clerk's session claims if needed!
  const userRole = req.user?.role || req.auth?.sessionClaims?.metadata?.role;

  const hasAdminPrivileges =
    userRole === "SUPERVISOR" ||
    userRole === "AREA_MANAGER" ||
    userRole === "SYSTEM_ADMIN";

  if (!hasAdminPrivileges) {
    throw createAppError(
      "Access Denied. This administrative operation is restricted to Supervisor personnel only.",
      403,
    );
  }

  next();
};
