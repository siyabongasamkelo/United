import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { QuizController } from "../controllers/QuizController";
import {
  hydrateLocalUser,
  requireSupervisor,
} from "../../../shared/middleware/authMiddleware";

const router = express.Router();
const controller = new QuizController();
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 👷 STAFF FIELD TEAM BOUNDARIES
 * Standard operators can fetch active training questionnaires and register digital safety signatures.
 */
router.get(
  "/available",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.getAvailableQuizzes,
);

router.post(
  "/submit",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.submitAnswers,
);

router.get(
  "/my-logs",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.getHistoryLogs,
);

/**
 * 📊 CORPORATE COMPLIANCE AUDITING ENDPOINTS
 * Restricts master branch tracking indices to management roles via requireSupervisor rules
 */
router.get(
  "/branch-analytics",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  requireSupervisor as express.RequestHandler,
  controller.getBranchMetrics,
);

// Add these to your existing routes in File 5

// Check for an active session or initialize a brand new one
router.post(
  "/start",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.startQuizSession,
);

// Save an individual answer instantly when the worker clicks next/selects an option
router.patch(
  "/save-answer",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.saveLiveAnswer,
);

export default router;
