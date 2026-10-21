"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const UserController_1 = require("../controllers/UserController");
// ✅ Pristine absolute path alias pointing straight to your shared middleware folder!
const authMiddleware_1 = require("../../../shared/middleware/authMiddleware.js");
const router = express_1.default.Router();
const controller = new UserController_1.UserController();
// Cast Clerk's middleware function to clear any version signature type mismatches
const clerkAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
/**
 * 👷 OPERATIONAL ENDPOINTS
 */
router.post("/sync", controller.onboardOrSync);
router.get("/profile", clerkAuth, controller.getProfile);
/**
 * 📊 ADMINISTRATIVE ENDPOINTS (Supervisor/Admin Access Only)
 */
router.post("/assign-store", clerkAuth, authMiddleware_1.requireSupervisor, controller.assignStore);
router.patch("/toggle-status", clerkAuth, authMiddleware_1.requireSupervisor, controller.toggleStatus);
exports.default = router;
