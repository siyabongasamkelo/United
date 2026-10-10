import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const clockInPayloadSchema = z.object({
  branchId: z
    .string()
    .min(1, "Target branch operational boundary reference code is mandatory")
    .regex(
      objectIdRegex,
      "Invalid database branch structural identifier structure",
    ),
  shiftWave: z.enum(["MORNING", "REINFORCEMENT", "NIGHT_SWEEPERS"]),

  // ✅ CURRENT MODERN SYNTAX FIXED BASED ON YOUR PATTERN
  latitude: z.number({
    message: "Live GPS latitude metric mapping is required",
  }),

  // ✅ CURRENT MODERN SYNTAX FIXED BASED ON YOUR PATTERN
  longitude: z.number({
    message: "Live GPS longitude metric mapping is required",
  }),

  ppeDeclaration: z.object({
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
  }),
});

export type ClockInInput = z.infer<typeof clockInPayloadSchema>;
