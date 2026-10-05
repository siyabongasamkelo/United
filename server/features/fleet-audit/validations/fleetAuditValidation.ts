import { z } from "zod";

// 🔍 Simple Regex to validate standard 24-character MongoDB ObjectIds
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// ❶ SUB-DOCUMENT VALIDATION SCHEMA: Trolley Metrics
export const trolleyMetricsValidationSchema = z.object({
  total: z
    .number({ message: "Total trolley fleet count must be a number" })
    .int("Total trolleys must be a whole number")
    .nonnegative("Total trolley count cannot be negative"),
  damaged: z
    .number({ message: "Damaged count must be a number" })
    .int("Damaged count must be a whole number")
    .nonnegative("Damaged trolley count cannot be negative")
    .default(0),
  dirty: z
    .number({ message: "Dirty count must be a number" })
    .int("Dirty count must be a whole number")
    .nonnegative("Dirty trolley count cannot be negative")
    .default(0),
});

// ❷ MAIN AUDIT CREATION PAYLOAD VALIDATION SCHEMA
export const fleetAuditPayloadValidationSchema = z
  .object({
    auditDate: z
      .string()
      .min(1, "Audit confirmation date is required")
      .datetime("Audit date must be a valid ISO 8601 date string")
      .trim(),
    store: z
      .string()
      .min(1, "Target store reference is mandatory")
      .regex(objectIdRegex, "Invalid MongoDB store identifier format")
      .trim(),
    branch: z
      .string()
      .min(1, "Target branch reference is mandatory")
      .regex(objectIdRegex, "Invalid MongoDB branch identifier format")
      .trim(),
    company: z
      .string()
      .min(1, "Responsible collection company reference is mandatory")
      .regex(objectIdRegex, "Invalid MongoDB company identifier format")
      .trim(),
    // Note: 'author' is intentionally left out here. We will append the logged-in
    // User ID directly from our authMiddleware session inside the controller layer.
    metrics: trolleyMetricsValidationSchema,
    images: z
      .array(
        z
          .string()
          .url("Each audit asset must point to a secure media URL link"),
      )
      .default([]),
    notes: z
      .string()
      .max(500, "Inspector notes cannot exceed 500 characters")
      .trim()
      .optional(),
  })
  // Custom business rules matching our syntax structure
  .refine(
    (data) => data.metrics.damaged + data.metrics.dirty <= data.metrics.total,
    {
      message:
        "Combined damaged and dirty count cannot exceed total trolley count",
      path: ["metrics"], // Attaches the error directly to the metrics block
    },
  );

// ❸ INFERRED TYPES FOR EXTRA SECURITY
export type FleetAuditPayloadInput = z.infer<
  typeof fleetAuditPayloadValidationSchema
>;
export type TrolleyMetricsInput = z.infer<
  typeof trolleyMetricsValidationSchema
>;
