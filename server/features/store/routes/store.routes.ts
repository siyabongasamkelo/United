import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { StoreController } from "../controllers/StoreController";
import { hydrateLocalUser } from "../../../shared/middleware/authMiddleware";

const router = express.Router();
const controller = new StoreController();
const clerkAuth = ClerkExpressRequireAuth() as any;

/**
 * 🏢 CORPORATE SITE LOCATION MANAGEMENT
 * GET: Fetches authorized stores matching the operator's tracking context layout [8]
 */
router.get(
  "/my-branch-stores",
  clerkAuth,
  hydrateLocalUser as express.RequestHandler,
  controller.getBranchStores,
);

export default router;
