import { z } from "zod";

// 📱 South African Phone Number Regex (Validates: +27..., 082..., 011..., etc.)
const saPhoneRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;

// ❶ SUB-DOCUMENT VALIDATION SCHEMA: Assigned Stores
export const assignedStoreValidationSchema = z.object({
  storeId: z.string().min(1, "Store ID is mandatory").trim(),
  storeName: z.string().min(1, "Store Name is mandatory").trim(),
});

// ❷ MAIN REGISTRATION / UPDATE INPUT VALIDATION SCHEMA
export const userPayloadValidationSchema = z.object({
  clerkId: z.string().min(1, "Clerk identity anchor is mandatory").trim(),
  email: z
    .string()
    .min(1, "Corporate or personal email is required")
    .email("Please provide a grammatically valid email address")
    .toLowerCase()
    .trim(),
  username: z
    .string()
    .min(1, "Profile username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username cannot exceed 30 characters")
    .trim(),
  fullName: z
    .string()
    .min(1, "Full operational name is required")
    .min(3, "Full name must contain both first and last name values")
    .trim(),
  contactNumber: z
    .string()
    .min(1, "Primary voice contact line is required")
    .regex(
      saPhoneRegex,
      "Please enter a valid South African cellular contact number",
    ),
  whatsappNumber: z
    .string()
    .min(1, "WhatsApp operational dispatch line is required")
    .regex(
      saPhoneRegex,
      "Please enter a valid South African WhatsApp cellular number",
    ),
  address: z
    .string()
    .min(1, "Residential home address is required for compliance")
    .min(5, "Please provide a complete physical address layout")
    .trim(),
  role: z.enum(["PORTER", "SUPERVISOR", "AREA_MANAGER", "SYSTEM_ADMIN"]),
  company: z
    .string()

    .trim()
    .default("United Trolley Services"),
  branchId: z.string().nullable().default("GATEWAY_DURBAN"), // Allows null fields for Area Managers [1.1]
  profilePhoto: z
    .string()
    .url("Profile asset must point to a secure media URL link")
    .optional(),
  assignedStores: z.array(assignedStoreValidationSchema).default([]),
});

// ❸ INFERRED TYPES FOR EXTRA SECURITY
export type UserPayloadInput = z.infer<typeof userPayloadValidationSchema>;
export type AssignedStoreInput = z.infer<typeof assignedStoreValidationSchema>;
