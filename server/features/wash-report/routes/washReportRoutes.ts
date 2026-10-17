import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { WashReportController } from "../controllers/WashReportController";
import { hydrateLocalUser } from "../../../shared/middleware/authMiddleware";

const router = express.Router();
const controller = new WashReportController();
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 🛒 WASHING FLOOR DISPATCH GATEWAYS
 * Log dirty/contaminated asset status on the fly straight from the lanes
 */
router.post(
  "/report-dirty",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.logWashReport,
);

/**
 * 🧼 BATCH RESOLUTION GATEWAY
 * Mark all active dirty trolley tickets belonging to a specific store as completely washed
 */
router.put(
  "/resolve-store/:storeId",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.resolveStoreQueue,
);

/**
 * 📋 WASH BAY MANAGEMENT PANEL CONTROL
 * Fetches data tracking profiles for live tracking dashboards
 */
router.get(
  "/wash-queue",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.getActiveQueue,
);

export default router;
