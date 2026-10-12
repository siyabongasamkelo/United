"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const FleetAuditController_1 = require("../controllers/FleetAuditController");
const authMiddleware_1 = require("@/shared/middleware/authMiddleware");
// ✅ Pristine absolute path alias pointing straight to your shared middleware folder!
const router = express_1.default.Router();
const controller = new FleetAuditController_1.FleetAuditController();
// Cast Clerk's middleware function to clear any version signature type mismatches
const clerkAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
/**
 * 👷 OPERATIONAL / FIELD TEAM ENDPOINTS
 * Accessible by authenticated staff members on the floor (Porters, Supervisors, etc.)
 */
router.post("/", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.submitAudit);
router.get("/detail/:id", clerkAuth, controller.getAuditById);
/**
 * 📊 ADMINISTRATIVE & METRIC ENDPOINTS
 * Restricted to Supervisors, Area Managers, and System Admins via requireSupervisor
 */
router.get("/daily", clerkAuth, authMiddleware_1.hydrateLocalUser, authMiddleware_1.requireSupervisor, controller.getDailyAudits);
router.get("/weekly", clerkAuth, authMiddleware_1.hydrateLocalUser, authMiddleware_1.requireSupervisor, controller.getWeeklyAudits);
router.get("/monthly", clerkAuth, authMiddleware_1.hydrateLocalUser, authMiddleware_1.requireSupervisor, controller.getMonthlyAudits);
router.get("/analytics", clerkAuth, authMiddleware_1.hydrateLocalUser, authMiddleware_1.requireSupervisor, controller.getAuditAnalytics);
exports.default = router;
