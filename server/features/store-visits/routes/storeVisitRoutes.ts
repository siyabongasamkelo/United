import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { StoreVisitController } from "../controllers/StoreVisitController";
import { storeScanPayloadValidationSchema } from "../validations/storeVisitValidation";
import {
  hydrateLocalUser,
  requireSupervisor,
} from "@/shared/middleware/authMiddleware";
// import { validateMiddleware } from "@/shared/middleware/validate.middleware"; // 🧠 Your global pipeline parser

const router = express.Router();
const controller = new StoreVisitController();
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 🛰️ FRONT-LINE OPERATOR / PORTER ENDPOINTS
 * Executed on the floor via the mobile terminal web scanner application interface
 */
router.post(
  "/scan",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  // validateMiddleware(storeScanPayloadValidationSchema), // 🛡️ Border Shield: Blocks bad payloads right here!
  controller.processStoreScan,
);

/**
 * 📊 ADMINISTRATIVE / SUPERVISOR CONTROLS
 * Locks down analytical dashboards, fraud alert timelines, and history tracks
 */
router.get(
  "/timeline/:porterId",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  requireSupervisor as express.RequestHandler,
  controller.getPorterTimeline,
);

router.get(
  "/fraud-alerts",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  requireSupervisor as express.RequestHandler,
  controller.getBranchFraudAlerts,
);

router.get(
  "/analytics/summary",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  requireSupervisor as express.RequestHandler,
  controller.getBranchPerformanceSummary,
);

export default router;
