"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clockOutPayloadSchema = exports.clockInPayloadSchema = exports.ppeDeclarationValidationSchema = void 0;
// 📂 File: server/features/attendance/validations/attendanceValidation.ts
const zod_1 = require("zod");
// 🔍 Simple Regex to validate standard 24-character MongoDB ObjectIds
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
// ❶ SUB-DOCUMENT VALIDATION OBJECT: Personal Protective Equipment Checklist
exports.ppeDeclarationValidationSchema = zod_1.z.object({
    hasSafetyBoots: zod_1.z.boolean().refine((val) => val === true, {
        message: "Compliance Violation: You cannot clock in without steel-toe safety boots.",
    }),
    hasReflectorVest: zod_1.z.boolean().refine((val) => val === true, {
        message: "Compliance Violation: High-visibility reflector vests are legally mandatory on the floor.",
    }),
    hasSteeringRope: zod_1.z.boolean().refine((val) => val === true, {
        message: "Compliance Violation: Standard 5-trolley steering ropes must be present before shift activation.",
    }),
});
// ❷ MAIN INITIALIZATION PIPELINE SCHEMA: Shift Activation Request
exports.clockInPayloadSchema = zod_1.z.object({
    branchId: zod_1.z
        .string()
        .min(1, "Target branch operational boundary reference code is mandatory")
        .regex(objectIdRegex, "Invalid database branch structural identifier structure")
        .trim(),
    shiftWave: zod_1.z.enum(["MORNING", "REINFORCEMENT", "NIGHT_SWEEPERS"], {
        message: "Please select a valid scheduled shift wave assignment window.",
    }),
    latitude: zod_1.z.number({
        message: "Live GPS latitude metric mapping is required",
    }),
    longitude: zod_1.z.number({
        message: "Live GPS longitude metric mapping is required",
    }),
    ppeDeclaration: exports.ppeDeclarationValidationSchema,
    // DEVICE TELEMETRY GATES (Optional but highly structured fields)
    telemetry: zod_1.z
        .object({
        batteryLevel: zod_1.z
            .number({ message: "Battery must be a number" })
            .min(0)
            .max(1)
            .optional(),
        platform: zod_1.z.string().trim().optional(),
    })
        .optional(),
    shiftNotes: zod_1.z
        .string()
        .max(300, "Shift notes cannot pass the 300 character constraint gate")
        .trim()
        .optional(),
    ppeSelfieUrl: zod_1.z
        .string()
        .url("OHS verification selfie upload path must point to a secure CDN asset URL link")
        .trim()
        .optional(),
});
// ❸ LIFECYCLE TERMINATION PIPELINE SCHEMA: Shift Closure Request
exports.clockOutPayloadSchema = zod_1.z.object({
    branchId: zod_1.z
        .string()
        .min(1, "Target branch context anchor reference is required")
        .regex(objectIdRegex, "Invalid database branch structural identifier structure")
        .trim(),
    // 🚀 FIXED HERE AS WELL
    latitude: zod_1.z.number({
        message: "Live GPS latitude metric mapping is required for clock-out geofencing",
    }),
    longitude: zod_1.z.number({
        message: "Live GPS longitude metric mapping is required for clock-out geofencing",
    }),
});
