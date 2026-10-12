"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    userService;
    constructor() {
        this.userService = new UserService_1.UserService();
    }
    onboardOrSync = async (req, res, next) => {
        try {
            const user = await this.userService.onboardOrSyncUser(req.body);
            res.status(201).json({ success: true, data: user });
        }
        catch (error) {
            next(error); // 🎯 Seamlessly forwards straight to our centralized error handler middleware!
        }
    };
    getProfile = async (req, res, next) => {
        try {
            const clerkId = req.auth?.userId;
            if (!clerkId) {
                res
                    .status(401)
                    .json({
                    success: false,
                    error: "Missing identity token parameters.",
                });
                return;
            }
            const profile = await this.userService.getUserProfile(clerkId);
            res.status(200).json({ success: true, data: profile });
        }
        catch (error) {
            next(error);
        }
    };
    assignStore = async (req, res, next) => {
        try {
            const { clerkId, storeId, storeName } = req.body;
            const updatedUser = await this.userService.assignStoreToOperator(clerkId, storeId, storeName);
            res
                .status(200)
                .json({
                success: true,
                message: "Retail layout target updated.",
                data: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    };
    toggleStatus = async (req, res, next) => {
        try {
            const { clerkId, isActive } = req.body;
            const updatedUser = await this.userService.toggleUserOperationalStatus(clerkId, isActive);
            res
                .status(200)
                .json({
                success: true,
                message: `Account state shifted successfully.`,
                data: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserController = UserController;
