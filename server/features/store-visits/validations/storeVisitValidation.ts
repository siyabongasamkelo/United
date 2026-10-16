import { z } from "zod";

// 🔍 Simple Regex to validate standard 24-character MongoDB ObjectIds
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const storeScanPayloadValidationSchema = z.object({
  storeId: z
    .string({ message: "Target store reference identifier is required" })
    .min(1, "Target store reference is mandatory")
    .regex(objectIdRegex, "Invalid MongoDB store identifier format")
    .trim(),
  latitude: z
    .number({
      message: "Device hardware latitude coordinate must be a numeric value",
    })
    .min(-90, "Latitude cannot be less than -90 degrees")
    .max(90, "Latitude cannot exceed 90 degrees"),
  longitude: z
    .number({
      message: "Device hardware longitude coordinate must be a numeric value",
    })
    .min(-180, "Longitude cannot be less than -180 degrees")
    .max(180, "Longitude cannot exceed 180 degrees"),
});

// Inferred type for controller parameter signatures and testing hooks
export type StoreScanPayloadInput = z.infer<
  typeof storeScanPayloadValidationSchema
>;
