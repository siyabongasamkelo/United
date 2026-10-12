"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_repository_js_1 = require("../repositories/auth.repository.js");
// import { IAuthCredentials } from "../models/auth.model.js";
const ApiError_js_1 = require("../../../utils/ApiError.js");
const sendEmail_js_1 = __importDefault(require("../../../utils/sendEmail.js"));
const emailTemplates_js_1 = require("../templates/emailTemplates.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_js_1 = __importDefault(require("../../../utils/logger.js"));
const authRepo = new auth_repository_js_1.AuthRepository();
class AuthService {
    generateSecureToken() {
        return crypto_1.default.randomBytes(32).toString("hex");
    }
    // Path A: Standard Self-Registration (Students)
    async registerStudent(email, passwordPlain) {
        const existing = await authRepo.findByIdentifier(email);
        if (existing)
            throw new ApiError_js_1.ApiError(409, "An identical identity record already exists on the network.");
        const salt = await bcrypt_1.default.genSalt(12);
        const passwordHash = await bcrypt_1.default.hash(passwordPlain, salt);
        const verificationToken = this.generateSecureToken();
        const newUser = await authRepo.create({
            identifiers: [{ type: "email", value: email }],
            passwordHash,
            role: "student",
            isEmailVerified: false,
            isPasswordSet: true, // They chose a password right away
            emailVerificationToken: verificationToken,
            emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailContent = (0, emailTemplates_js_1.getVerificationTemplate)(verifyUrl);
        // Fire-and-forget background mailing execution
        (0, sendEmail_js_1.default)({
            to: email,
            subject: "Verify your Account Registration",
            ...emailContent,
        }).catch((err) => logger_js_1.default.error(`Mailing Delivery System Failure on Student Signup: ${err.message}`));
        return newUser;
    }
    // Path B: Administrative Account Provisioning (No password collected upfront)
    async adminProvisionUser(email, role, staffNumber, nationalId) {
        const existing = await authRepo.findByIdentifier(email);
        if (existing)
            throw new ApiError_js_1.ApiError(409, "This individual identity is already registered.");
        // 🛠️ FIX: Explicitly type the array using our interface so it allows all three types!
        const identifiers = [{ type: "email", value: email }];
        if (staffNumber)
            identifiers.push({ type: "staff_number", value: staffNumber });
        if (nationalId)
            identifiers.push({ type: "national_id", value: nationalId });
        const setupToken = this.generateSecureToken();
        const newUser = await authRepo.create({
            identifiers, // TypeScript is completely happy now!
            role,
            isEmailVerified: true,
            isPasswordSet: false,
            accountSetupToken: setupToken,
            accountSetupExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
        });
        const setupUrl = `${process.env.FRONTEND_URL}/setup-password?token=${setupToken}`;
        const emailContent = (0, emailTemplates_js_1.getWelcomeSetupTemplate)(setupUrl);
        (0, sendEmail_js_1.default)({
            to: email,
            subject: "Action Required: Complete your Account Architecture Configuration",
            ...emailContent,
        }).catch((err) => logger_js_1.default.error(`Mailing Delivery System Failure on Admin Provisioning: ${err.message}`));
        return newUser;
    }
    // Path C: Password Generation Hook for Provisioned Accounts
    async finalizeAccountSetup(token, passwordPlain) {
        const user = await authRepo.findBySetupToken(token);
        if (!user)
            throw new ApiError_js_1.ApiError(400, "Validation token invalid or expired.");
        const salt = await bcrypt_1.default.genSalt(12);
        user.passwordHash = await bcrypt_1.default.hash(passwordPlain, salt);
        user.isPasswordSet = true; // Account finalized!
        user.accountSetupToken = undefined;
        user.accountSetupExpires = undefined;
        await authRepo.save(user);
        logger_js_1.default.info(`Provisioned profile registration confirmed for AuthID: ${user._id}`);
    }
    // Path D: Dynamic Authentication Orchestrator
    async login(identifierInput, passwordPlain) {
        const user = await authRepo.findByIdentifier(identifierInput);
        if (!user || !user.isActive)
            throw new ApiError_js_1.ApiError(401, "Invalid credentials provided.");
        // 🔒 Security Guard block check
        if (!user.isPasswordSet) {
            throw new ApiError_js_1.ApiError(403, "Account password configuration outstanding. Please follow the setup invitation link sent to your email.");
        }
        const isMatch = await bcrypt_1.default.compare(passwordPlain, user.passwordHash || "");
        if (!isMatch)
            throw new ApiError_js_1.ApiError(401, "Invalid credentials provided.");
        user.lastLoginAt = new Date();
        await authRepo.save(user);
        const token = jsonwebtoken_1.default.sign({ authId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return { token, role: user.role };
    }
}
exports.AuthService = AuthService;
