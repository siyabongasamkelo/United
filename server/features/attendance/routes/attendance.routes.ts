import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { AttendanceController } from "../controllers/AttendanceController";
import { hydrateLocalUser } from "../../../shared/middleware/authMiddleware";

const router = express.Router();
const controller = new AttendanceController();
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 🛰️ TIME & ATTENDANCE FIELD OPERATIONS
 * POST: Transmits live GPS vectors and un-skippable PPE checklist metrics for secure evaluation
 */
router.post(
  "/clock-in",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.processClockIn,
);

/**
 * GET: Pulls active session tracking history logs matching the calendar timestamp windows
 */
router.get(
  "/my-today-logs",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.getMyTodayHistory,
);

export default router;
