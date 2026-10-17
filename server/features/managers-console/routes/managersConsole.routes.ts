import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { ManagersConsoleController } from "../controllers/ManagersConsoleController";
import { hydrateLocalUser } from "../../../shared/middleware/authMiddleware";

const router = express.Router();
const controller = new ManagersConsoleController();
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 📊 EXECUTIVE CONSOLE DATA BLOCKS
 * Fetches the combined, latest aggregated fleet statistics for operational tracking screens
 * Route Path Gateway: GET /api/v1/managers-console/summary
 */
router.get(
  "/summary/:branchId", // 🚀 Appended the dynamic branch parameter hook here
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.getDashboardSummary,
);

export default router;
