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
