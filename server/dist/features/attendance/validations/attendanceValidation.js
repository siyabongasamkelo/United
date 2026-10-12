"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clockInPayloadSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.clockInPayloadSchema = zod_1.z.object({
    branchId: zod_1.z
        .string()
        .min(1, "Target branch operational boundary reference code is mandatory")
        .regex(objectIdRegex, "Invalid database branch structural identifier structure"),
    shiftWave: zod_1.z.enum(["MORNING", "REINFORCEMENT", "NIGHT_SWEEPERS"]),
    // ✅ CURRENT MODERN SYNTAX FIXED BASED ON YOUR PATTERN
    latitude: zod_1.z.number({
        message: "Live GPS latitude metric mapping is required",
    }),
    // ✅ CURRENT MODERN SYNTAX FIXED BASED ON YOUR PATTERN
    longitude: zod_1.z.number({
        message: "Live GPS longitude metric mapping is required",
    }),
    ppeDeclaration: zod_1.z.object({
        hasSafetyBoots: zod_1.z.boolean().refine((val) => val === true, {
            message: "Compliance Violation: You cannot clock in without steel-toe safety boots.",
        }),
        hasReflectorVest: zod_1.z.boolean().refine((val) => val === true, {
            message: "Compliance Violation: High-visibility reflector vests are legally mandatory on the floor.",
        }),
        hasSteeringRope: zod_1.z.boolean().refine((val) => val === true, {
            message: "Compliance Violation: Standard 5-trolley steering ropes must be present before shift activation.",
        }),
    }),
});
