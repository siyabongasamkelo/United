"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCredentials = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LoginIdentifierSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["email", "staff_number", "national_id"],
        required: true,
    },
    value: { type: String, required: true, lowercase: true, trim: true },
});
const AuthCredentialsSchema = new mongoose_1.Schema({
    identifiers: [LoginIdentifierSchema],
    passwordHash: { type: String },
    role: { type: String, enum: ["admin", "staff", "student"], required: true },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isPasswordSet: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    accountSetupToken: { type: String },
    accountSetupExpires: { type: Date },
    lastLoginAt: { type: Date },
}, { timestamps: true });
// Universal structural constraint enforcing unique login variables across the whole platform
AuthCredentialsSchema.index({ "identifiers.value": 1 }, { unique: true });
AuthCredentialsSchema.index({ emailVerificationToken: 1 });
AuthCredentialsSchema.index({ passwordResetToken: 1 });
AuthCredentialsSchema.index({ accountSetupToken: 1 });
exports.AuthCredentials = mongoose_1.default.model("Sys_Auth_Credentials", AuthCredentialsSchema);
