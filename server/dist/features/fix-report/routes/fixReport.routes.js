"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const FixReportController_1 = require("../controllers/FixReportController");
const authMiddleware_1 = require("../../../shared/middleware/authMiddleware");
const router = express_1.default.Router();
const controller = new FixReportController_1.FixReportController();
const clerkAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
/**
 * 🛒 DEPLOYMENT TEAM BOUNDARY PORTALS
 * Log operational damage inputs on the fly directly from the mall floor layout lanes
 */
router.post("/report-fault", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.logFaultReport);
/**
 * 🛠️ BATCH MAINTENANCE RESOLUTION GATEWAY
 * Wipes out all active broken trolley tickets belonging to a single store when the bakkie returns
 */
router.put("/resolve-store/:storeId", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.resolveStoreQueue);
/**
 * 📋 AREA MANAGEMENT & WORKSHOP CONSOLE BALANCING OVERVIEW
 * Fetches data for the live queue tracker grid layout views
 */
router.get("/maintenance-queue", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getActiveQueue);
exports.default = router;
