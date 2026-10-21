"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 📂 File: features/attendance/routes/attendanceRoutes.ts
const express_1 = __importDefault(require("express"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const AttendanceController_1 = require("../controllers/AttendanceController");
const authMiddleware_1 = require("../../../shared/middleware/authMiddleware");
const router = express_1.default.Router();
const controller = new AttendanceController_1.AttendanceController();
const clerkAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
/**
 * 🛰️ TIME & ATTENDANCE FIELD OPERATIONS
 */
// 1. Clock-In Registration
router.post("/clock-in", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.processClockIn);
// 2. 🆕 Clock-Out Registration Gate
router.post("/clock-out", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.processClockOut);
// 3. User Daily Tracking History Log Recovery
router.get("/my-today-logs", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getMyTodayHistory);
exports.default = router;
