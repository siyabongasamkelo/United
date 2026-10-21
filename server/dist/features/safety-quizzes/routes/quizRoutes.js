"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const QuizController_1 = require("../controllers/QuizController");
const authMiddleware_1 = require("../../../shared/middleware/authMiddleware");
const router = express_1.default.Router();
const controller = new QuizController_1.QuizController();
const clerkAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
/**
 * 👷 STAFF FIELD TEAM BOUNDARIES
 * Standard operators can fetch active training questionnaires and register digital safety signatures.
 */
router.get("/available", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getAvailableQuizzes);
router.post("/submit", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.submitAnswers);
router.get("/my-logs", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getHistoryLogs);
/**
 * 📊 CORPORATE COMPLIANCE AUDITING ENDPOINTS
 * Restricts master branch tracking indices to management roles via requireSupervisor rules
 */
router.get("/branch-analytics", clerkAuth, authMiddleware_1.hydrateLocalUser, authMiddleware_1.requireSupervisor, controller.getBranchMetrics);
// Add these to your existing routes in File 5
// Check for an active session or initialize a brand new one
router.post("/start", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.startQuizSession);
// Save an individual answer instantly when the worker clicks next/selects an option
router.patch("/save-answer", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.saveLiveAnswer);
// Append this route inside your quizRoutes.ts file in File 5
router.get("/certificate/:attemptId", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getCertificateByAttempt);
exports.default = router;
