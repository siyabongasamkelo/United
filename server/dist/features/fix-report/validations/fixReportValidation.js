"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFixReportPayloadSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.createFixReportPayloadSchema = zod_1.z.object({
    trolleyId: zod_1.z
        .string()
        .min(3, "Trolley identifier reference code is too short")
        .max(15, "Trolley trace layout tag exceeded standard structure length")
        .toUpperCase()
        .trim(),
    storeOriginId: zod_1.z
        .string()
        .min(1, "Store parameter mapping identity indicator is required")
        .regex(objectIdRegex, "Invalid database store structure key format"),
    brokenComponent: zod_1.z.enum([
        "CASTOR_WHEELS",
        "BACK_GATE",
        "CHASSIS_FRAME",
        "ROPE_STEER_MOUNT",
        "OTHER",
    ]),
    damageSeverity: zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]),
    notes: zod_1.z.string().max(500, "Notes trace buffer limit exceeded").optional(),
    evidenceImageUrl: zod_1.z
        .string()
        .url("Evidence link sequence layout must be a verified absolute URL format")
        .optional(),
});
