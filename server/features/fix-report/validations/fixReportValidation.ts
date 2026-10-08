import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createFixReportPayloadSchema = z.object({
  trolleyId: z
    .string()
    .min(3, "Trolley identifier reference code is too short")
    .max(15, "Trolley trace layout tag exceeded standard structure length")
    .toUpperCase()
    .trim(),
  storeOriginId: z
    .string()
    .min(1, "Store parameter mapping identity indicator is required")
    .regex(objectIdRegex, "Invalid database store structure key format"),
  brokenComponent: z.enum([
    "CASTOR_WHEELS",
    "BACK_GATE",
    "CHASSIS_FRAME",
    "ROPE_STEER_MOUNT",
    "OTHER",
  ]),
  damageSeverity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  notes: z.string().max(500, "Notes trace buffer limit exceeded").optional(),
  evidenceImageUrl: z
    .string()
    .url("Evidence link sequence layout must be a verified absolute URL format")
    .optional(),
});

export type CreateFixReportInput = z.infer<typeof createFixReportPayloadSchema>;
