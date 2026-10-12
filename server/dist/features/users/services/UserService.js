"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const userValidation_1 = require("../schemas/userValidation");
// ✅ Changed from AppError class to the createAppError functional factory
const errorMiddleware_1 = require("../../../shared/middleware/errorMiddleware");
const logger_1 = require("../../../shared/telemetry/logger");
class UserService {
    userRepo;
    constructor() {
        this.userRepo = new UserRepository_1.UserRepository();
    }
    async onboardOrSyncUser(payload) {
        const startTime = performance.now();
        const validatedInput = userValidation_1.userPayloadValidationSchema.parse(payload);
        const formattedStores = validatedInput.assignedStores.map((store) => ({
            ...store,
            assignedAt: new Date(),
        }));
        const synchronizedUser = await this.userRepo.registerOrSyncUser(validatedInput.clerkId, validatedInput.email, {
            ...validatedInput,
            assignedStores: formattedStores,
        });
        logger_1.telemetry.info({
            event: "USER_SYNC_SUCCESS",
            clerkId: validatedInput.clerkId,
            role: validatedInput.role,
            durationMs: Math.round(performance.now() - startTime),
        });
        return synchronizedUser;
    }
    async getUserProfile(clerkId) {
        const user = await this.userRepo.getUserByClerkId(clerkId);
        // ✅ Updated to use the functional factory throw pattern
        if (!user) {
            throw (0, errorMiddleware_1.createAppError)(`Profile location lookup failed. User reference token match missing.`, 404);
        }
        return user;
    }
    async assignStoreToOperator(clerkId, storeId, storeName) {
        const user = await this.userRepo.getUserByClerkId(clerkId);
        // ✅ Updated to use the functional factory throw pattern
        if (!user)
            throw (0, errorMiddleware_1.createAppError)("Target employee profile could not be verified.", 404);
        if (!user.isActive)
            throw (0, errorMiddleware_1.createAppError)("Action denied. Cannot route retail targets to a suspended account.", 422);
        const updatedUser = await this.userRepo.assignStoreToPorter(clerkId, storeId, storeName);
        if (!updatedUser)
            throw (0, errorMiddleware_1.createAppError)("Failed to update system store destination indexes.", 500);
        logger_1.telemetry.info({
            event: "STORE_ROUTING_ASSIGNED",
            clerkId,
            storeId,
            storeName,
        });
        return updatedUser;
    }
    async toggleUserOperationalStatus(clerkId, isActive) {
        const updatedUser = await this.userRepo.setAccountStatus(clerkId, isActive);
        // ✅ Updated to use the functional factory throw pattern
        if (!updatedUser)
            throw (0, errorMiddleware_1.createAppError)("Account state modification request rejected or user missing.", 404);
        logger_1.telemetry.warn({
            event: "USER_STATUS_TOGGLED",
            clerkId,
            status: isActive ? "ACTIVE" : "SUSPENDED",
        });
        return updatedUser;
    }
}
exports.UserService = UserService;
