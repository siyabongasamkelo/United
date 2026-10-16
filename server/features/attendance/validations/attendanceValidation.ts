// 📂 File: server/features/attendance/validations/attendanceValidation.ts
import { z } from "zod";

// 🔍 Simple Regex to validate standard 24-character MongoDB ObjectIds
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// ❶ SUB-DOCUMENT VALIDATION OBJECT: Personal Protective Equipment Checklist
export const ppeDeclarationValidationSchema = z.object({
  hasSafetyBoots: z.boolean().refine((val) => val === true, {
    message:
      "Compliance Violation: You cannot clock in without steel-toe safety boots.",
  }),
  hasReflectorVest: z.boolean().refine((val) => val === true, {
    message:
      "Compliance Violation: High-visibility reflector vests are legally mandatory on the floor.",
  }),
  hasSteeringRope: z.boolean().refine((val) => val === true, {
    message:
      "Compliance Violation: Standard 5-trolley steering ropes must be present before shift activation.",
  }),
});

// ❷ MAIN INITIALIZATION PIPELINE SCHEMA: Shift Activation Request
export const clockInPayloadSchema = z.object({
  branchId: z
    .string()
    .min(1, "Target branch operational boundary reference code is mandatory")
    .regex(
      objectIdRegex,
      "Invalid database branch structural identifier structure",
    )
    .trim(),

  shiftWave: z.enum(["MORNING", "REINFORCEMENT", "NIGHT_SWEEPERS"], {
    message: "Please select a valid scheduled shift wave assignment window.",
  }),

  latitude: z.number({
    message: "Live GPS latitude metric mapping is required",
  }),

  longitude: z.number({
    message: "Live GPS longitude metric mapping is required",
  }),

  ppeDeclaration: ppeDeclarationValidationSchema,

  // DEVICE TELEMETRY GATES (Optional but highly structured fields)
  telemetry: z
    .object({
      batteryLevel: z
        .number({ message: "Battery must be a number" })
        .min(0)
        .max(1)
        .optional(),
      platform: z.string().trim().optional(),
    })
    .optional(),

  shiftNotes: z
    .string()
    .max(300, "Shift notes cannot pass the 300 character constraint gate")
    .trim()
    .optional(),

  ppeSelfieUrl: z
    .string()
    .url(
      "OHS verification selfie upload path must point to a secure CDN asset URL link",
    )
    .trim()
    .optional(),
});

// ❸ LIFECYCLE TERMINATION PIPELINE SCHEMA: Shift Closure Request
export const clockOutPayloadSchema = z.object({
  branchId: z
    .string()
    .min(1, "Target branch context anchor reference is required")
    .regex(
      objectIdRegex,
      "Invalid database branch structural identifier structure",
    )
    .trim(),

  // 🚀 FIXED HERE AS WELL
  latitude: z.number({
    message:
      "Live GPS latitude metric mapping is required for clock-out geofencing",
  }),

  longitude: z.number({
    message:
      "Live GPS longitude metric mapping is required for clock-out geofencing",
  }),
});

// ❹ INFERRED TYPES FOR EXTRA SECURITY
export type ClockInInput = z.infer<typeof clockInPayloadSchema>;
export type ClockOutInput = z.infer<typeof clockOutPayloadSchema>;
export type PpeDeclarationInput = z.infer<
  typeof ppeDeclarationValidationSchema
>;
