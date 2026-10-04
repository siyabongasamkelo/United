import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { UserController } from "../controllers/UserController";

// ✅ Pristine absolute path alias pointing straight to your shared middleware folder!
import { requireSupervisor } from "@/shared/middleware/authMiddleware";

const router = express.Router();
const controller = new UserController();

// Cast Clerk's middleware function to clear any version signature type mismatches
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 👷 OPERATIONAL ENDPOINTS
 */
router.post("/sync", controller.onboardOrSync);
router.get("/profile", clerkAuth, controller.getProfile);

/**
 * 📊 ADMINISTRATIVE ENDPOINTS (Supervisor/Admin Access Only)
 */
router.post(
  "/assign-store",
  clerkAuth,
  requireSupervisor as express.RequestHandler,
  controller.assignStore,
);

router.patch(
  "/toggle-status",
  clerkAuth,
  requireSupervisor as express.RequestHandler,
  controller.toggleStatus,
);

export default router;
