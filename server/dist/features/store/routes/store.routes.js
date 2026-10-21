"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const StoreController_1 = require("../controllers/StoreController");
const authMiddleware_1 = require("../../../shared/middleware/authMiddleware");
const router = express_1.default.Router();
const controller = new StoreController_1.StoreController();
const clerkAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
/**
 * 🏢 CORPORATE SITE LOCATION MANAGEMENT
 * GET: Fetches authorized stores matching the operator's tracking context layout [8]
 */
router.get("/my-branch-stores", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getBranchStores);
router.get("/my-branch-stores", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getBranchStores);
// 2. 🆕 NEW ENDPOINT: Fetches branches falling under an Area Manager's territory constraint
router.get("/area-branches", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getAreaBranches);
router.get("/branch-deep-dive/:branchId", clerkAuth, authMiddleware_1.hydrateLocalUser, controller.getBranchDeepDiveSummary);
exports.default = router;
