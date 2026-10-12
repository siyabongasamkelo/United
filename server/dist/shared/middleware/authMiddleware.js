"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSupervisor = exports.hydrateLocalUser = void 0;
const errorMiddleware_1 = require("../../shared/middleware/errorMiddleware");
// 🔗 Leverage the Repository layer directly to maintain zero-model coupling rules!
const UserRepository_1 = require("../../features/users/repositories/UserRepository");
/**
 * 🔒 SECURITY GATE: Hydrates raw Clerk identities with local MongoDB document references.
 * Placed immediately after Clerk's native validation engine across network routes.
 */
const hydrateLocalUser = async (req, res, next) => {
    try {
        const clerkId = req.auth?.userId;
        if (!clerkId) {
            throw (0, errorMiddleware_1.createAppError)("Authentication failed. No valid Clerk identity found on the request token pipeline.", 401);
        }
        // 🔍 Instantiate the data layer context to isolate raw Mongoose operations away
        const userRepo = new UserRepository_1.UserRepository();
        const localUser = await userRepo.getUserByClerkId(clerkId);
        // 🚨 If the user profile isn't synced into our local DB yet, reject early
        if (!localUser) {
            throw (0, errorMiddleware_1.createAppError)(`Operational profile synchronization missing. The identity "${clerkId}" must complete onboarding sync before performing system actions.`, 404);
        }
        // 🚫 Administrative Suspension Check: Block deactivated staff immediately at the perimeter
        if (!localUser.isActive) {
            throw (0, errorMiddleware_1.createAppError)("Access Denied. This account has been administratively suspended from operational duties.", 423);
        }
        // 🔥 Hydration Success: Bind the complete local database profile index straight to the request!
        req.user = localUser;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.hydrateLocalUser = hydrateLocalUser;
/**
 * 📊 ROLE PRIVILEGE CHECK: Restricts administrative routes to high-clearance personnel
 */
const requireSupervisor = (req, res, next) => {
    // We can now safely check the role directly from our pre-hydrated database user context,
    // or fall back to Clerk's session claims if needed!
    const userRole = req.user?.role || req.auth?.sessionClaims?.metadata?.role;
    const hasAdminPrivileges = userRole === "SUPERVISOR" ||
        userRole === "AREA_MANAGER" ||
        userRole === "SYSTEM_ADMIN";
    if (!hasAdminPrivileges) {
        throw (0, errorMiddleware_1.createAppError)("Access Denied. This administrative operation is restricted to Supervisor personnel only.", 403);
    }
    next();
};
exports.requireSupervisor = requireSupervisor;
