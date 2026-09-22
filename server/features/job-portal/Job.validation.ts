import { z } from "zod";

export const CreateJobListingSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    location: z.string().min(2, "Location is required"),
    employmentType: z.enum(["FULL_TIME", "PART_TIME", "CASUAL", "CONTRACT"]),
    salaryRange: z.object({
      min: z.number().positive(),
      max: z.number().positive(),
      currency: z.string().default("USD"),
      rate: z.enum(["HOURLY", "ANNUAL"]),
    }),
    requiredCertifications: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Test ID format"))
      .default([]),
    minPassingScoreRequired: z.number().min(0).max(100).default(80),
  }),
});

export const ApplyJobSchema = z.object({
  body: z.object({
    jobListingId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Job ID format"),
    verifiedScoresSnapshot: z.array(
      z.object({
        testId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Test ID format"),
        scorePercentage: z.number().min(0).max(100),
      }),
    ),
  }),
});
