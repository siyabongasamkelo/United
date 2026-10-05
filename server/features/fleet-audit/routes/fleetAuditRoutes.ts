import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { FleetAuditController } from "../controllers/FleetAuditController";
import {
  hydrateLocalUser,
  requireSupervisor,
} from "@/shared/middleware/authMiddleware";

// ✅ Pristine absolute path alias pointing straight to your shared middleware folder!

const router = express.Router();
const controller = new FleetAuditController();

// Cast Clerk's middleware function to clear any version signature type mismatches
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 👷 OPERATIONAL / FIELD TEAM ENDPOINTS
 * Accessible by authenticated staff members on the floor (Porters, Supervisors, etc.)
 */
router.post(
  "/",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.submitAudit,
);

router.get("/detail/:id", clerkAuth, controller.getAuditById);

/**
 * 📊 ADMINISTRATIVE & METRIC ENDPOINTS
 * Restricted to Supervisors, Area Managers, and System Admins via requireSupervisor
 */
router.get(
  "/daily",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  requireSupervisor as express.RequestHandler,
  controller.getDailyAudits,
);

router.get(
  "/weekly",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  requireSupervisor as express.RequestHandler,
  controller.getWeeklyAudits,
);

router.get(
  "/monthly",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  requireSupervisor as express.RequestHandler,
  controller.getMonthlyAudits,
);

router.get(
  "/analytics",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  requireSupervisor as express.RequestHandler,
  controller.getAuditAnalytics,
);

export default router;
