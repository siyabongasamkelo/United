"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.CompleteSetupSchema = exports.AdminCreateUserSchema = exports.StudentRegisterSchema = void 0;
const zod_1 = require("zod");
exports.StudentRegisterSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address format."),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters long."),
    }),
});
exports.AdminCreateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address format."),
        role: zod_1.z.enum(["admin", "staff"]),
        staffNumber: zod_1.z.string().optional(),
        nationalId: zod_1.z.string().optional(),
    }),
});
exports.CompleteSetupSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, "Setup or confirmation token is required."),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters long."),
    }),
});
exports.LoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        identifier: zod_1.z
            .string()
            .min(1, "Login identifier is required (Email, Staff ID, or National ID)."),
        password: zod_1.z.string().min(1, "Password field is required."),
    }),
});
