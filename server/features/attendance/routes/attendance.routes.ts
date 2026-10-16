// 📂 File: features/attendance/routes/attendanceRoutes.ts
import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { AttendanceController } from "../controllers/AttendanceController";
import { hydrateLocalUser } from "../../../shared/middleware/authMiddleware";

const router = express.Router();
const controller = new AttendanceController();
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 🛰️ TIME & ATTENDANCE FIELD OPERATIONS
 */

// 1. Clock-In Registration
router.post(
  "/clock-in",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.processClockIn,
);

// 2. 🆕 Clock-Out Registration Gate
router.post(
  "/clock-out",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.processClockOut,
);

// 3. User Daily Tracking History Log Recovery
router.get(
  "/my-today-logs",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.getMyTodayHistory,
);

export default router;
