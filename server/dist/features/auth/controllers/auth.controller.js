"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const authService = new auth_service_js_1.AuthService();
class AuthController {
    async registerStudent(req, res, next) {
        try {
            const { email, password } = req.body;
            await authService.registerStudent(email, password);
            res
                .status(201)
                .json({
                success: true,
                message: "Registration successful. Please verify your email address.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async adminProvision(req, res, next) {
        try {
            const { email, role, staffNumber, nationalId } = req.body;
            await authService.adminProvisionUser(email, role, staffNumber, nationalId);
            res
                .status(201)
                .json({
                success: true,
                message: "User account provisioned and invitation email sent.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async setupPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            await authService.finalizeAccountSetup(token, password);
            res
                .status(200)
                .json({
                success: true,
                message: "Password configured successfully. You may now log in.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { identifier, password } = req.body;
            const result = await authService.login(identifier, password);
            res
                .status(200)
                .json({
                success: true,
                message: "Authentication successful.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
