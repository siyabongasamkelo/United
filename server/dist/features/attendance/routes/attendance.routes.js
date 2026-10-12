"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const AttendanceController_1 = require("../controllers/AttendanceController");
const authMiddleware_1 = require("../../../shared/middleware/authMiddleware");
const router = express_1.default.Router();
const controller = new AttendanceController_1.AttendanceController();
const clerkAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
/**
 * 🛰️ TIME & ATTENDANCE FIELD OPERATIONS
 * POST: Transmits live GPS vectors and un-skippable PPE checklist metrics for secure evaluation
 */
router.post("/clock-in", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.processClockIn);
/**
 * GET: Pulls active session tracking history logs matching the calendar timestamp windows
 */
router.get("/my-today-logs", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getMyTodayHistory);
exports.default = router;
