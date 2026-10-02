// middlewares/authorize.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

// 🛠️ TypeScript Declaration Merging:
// This tells TypeScript that the Express Request object safely contains our verified user payload.
declare global {
  namespace Express {
    interface Request {
      user?: {
        authId: string;
        role: "admin" | "staff" | "student";
      };
    }
  }
}

interface DecodedJwtPayload {
  authId: string;
  role: "admin" | "staff" | "student";
}

/**
 * Pluggable Guard Middleware to authenticate JWT tokens and restrict route access by user roles.
 * @param allowedRoles Array of strings specifying which roles are authorized to access the endpoint.
 */
export const authorizeRoles = (
  ...allowedRoles: Array<"admin" | "staff" | "student">
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      // 🔍 Step 1: Check if the authorization header exists and follows the 'Bearer <token>' pattern
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(
          401,
          "Access denied. Authentication token is missing or malformed.",
        );
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new ApiError(401, "Access denied. Token payload is invalid.");
      }

      // 🎟️ Step 2: Verify the JWT token integrity against your server secret
      let decoded: DecodedJwtPayload;
      try {
        decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string,
        ) as DecodedJwtPayload;
      } catch (jwtError: any) {
        logger.warn(`JWT verification rejected: ${jwtError.message}`);

        if (jwtError.name === "TokenExpiredError") {
          throw new ApiError(
            401,
            "Your session has expired. Please log in again.",
          );
        }
        throw new ApiError(
          401,
          "Authentication failed. Invalid token session.",
        );
      }

      // 👤 Step 3: Attach the sanitized payload metadata straight to the Request execution context
      req.user = {
        authId: decoded.authId,
        role: decoded.role,
      };

      // 🛑 Step 4: Role-Based Authorization Guard Lock
      // If allowedRoles is empty, it means the route only requires a valid login (any role can enter)
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        logger.warn(
          `Unauthorized role breach attempt. AuthId: ${decoded.authId}, Role: ${decoded.role} tried accessing restricted path.`,
        );
        throw new ApiError(
          403,
          `Access forbidden. This action is restricted to: [${allowedRoles.join(", ")}].`,
        );
      }

      // Clean execution handover to the next controller layer down the wire
      next();
    } catch (error) {
      next(error);
    }
  };
};
