import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { FixReportController } from "../controllers/FixReportController";
import {
  hydrateLocalUser,
  requireSupervisor,
} from "../../../shared/middleware/authMiddleware";

const router = express.Router();
const controller = new FixReportController();
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 🛒 DEPLOYMENT TEAM BOUNDARY PORTALS
 * Log operational damage inputs on the fly directly from the mall floor layout lanes
 */
router.post(
  "/report-fault",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.logFaultReport,
);

/**
 * 🛠️ BATCH MAINTENANCE RESOLUTION GATEWAY
 * Wipes out all active broken trolley tickets belonging to a single store when the bakkie returns
 */
router.put(
  "/resolve-store/:storeId",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.resolveStoreQueue,
);

/**
 * 📋 AREA MANAGEMENT & WORKSHOP CONSOLE BALANCING OVERVIEW
 * Fetches data for the live queue tracker grid layout views
 */
router.get(
  "/maintenance-queue",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.getActiveQueue,
);

export default router;
