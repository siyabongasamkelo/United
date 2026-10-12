"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPayloadValidationSchema = exports.assignedStoreValidationSchema = void 0;
const zod_1 = require("zod");
// 📱 South African Phone Number Regex (Validates: +27..., 082..., 011..., etc.)
const saPhoneRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;
// ❶ SUB-DOCUMENT VALIDATION SCHEMA: Assigned Stores
exports.assignedStoreValidationSchema = zod_1.z.object({
    storeId: zod_1.z.string().min(1, "Store ID is mandatory").trim(),
    storeName: zod_1.z.string().min(1, "Store Name is mandatory").trim(),
});
// ❷ MAIN REGISTRATION / UPDATE INPUT VALIDATION SCHEMA
exports.userPayloadValidationSchema = zod_1.z.object({
    clerkId: zod_1.z.string().min(1, "Clerk identity anchor is mandatory").trim(),
    email: zod_1.z
        .string()
        .min(1, "Corporate or personal email is required")
        .email("Please provide a grammatically valid email address")
        .toLowerCase()
        .trim(),
    username: zod_1.z
        .string()
        .min(1, "Profile username is required")
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username cannot exceed 30 characters")
        .trim(),
    fullName: zod_1.z
        .string()
        .min(1, "Full operational name is required")
        .min(3, "Full name must contain both first and last name values")
        .trim(),
    contactNumber: zod_1.z
        .string()
        .min(1, "Primary voice contact line is required")
        .regex(saPhoneRegex, "Please enter a valid South African cellular contact number"),
    whatsappNumber: zod_1.z
        .string()
        .min(1, "WhatsApp operational dispatch line is required")
        .regex(saPhoneRegex, "Please enter a valid South African WhatsApp cellular number"),
    address: zod_1.z
        .string()
        .min(1, "Residential home address is required for compliance")
        .min(5, "Please provide a complete physical address layout")
        .trim(),
    role: zod_1.z.enum(["PORTER", "SUPERVISOR", "AREA_MANAGER", "SYSTEM_ADMIN"]),
    company: zod_1.z
        .string()
        .trim()
        .default("United Trolley Services"),
    branchId: zod_1.z.string().nullable().default("GATEWAY_DURBAN"), // Allows null fields for Area Managers [1.1]
    profilePhoto: zod_1.z
        .string()
        .url("Profile asset must point to a secure media URL link")
        .optional(),
    assignedStores: zod_1.z.array(exports.assignedStoreValidationSchema).default([]),
});
