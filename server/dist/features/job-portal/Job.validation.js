"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyJobSchema = exports.CreateJobListingSchema = void 0;
const zod_1 = require("zod");
exports.CreateJobListingSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
        description: zod_1.z
            .string()
            .min(10, "Description must be at least 10 characters"),
        location: zod_1.z.string().min(2, "Location is required"),
        employmentType: zod_1.z.enum(["FULL_TIME", "PART_TIME", "CASUAL", "CONTRACT"]),
        salaryRange: zod_1.z.object({
            min: zod_1.z.number().positive(),
            max: zod_1.z.number().positive(),
            currency: zod_1.z.string().default("USD"),
            rate: zod_1.z.enum(["HOURLY", "ANNUAL"]),
        }),
        requiredCertifications: zod_1.z
            .array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Test ID format"))
            .default([]),
        minPassingScoreRequired: zod_1.z.number().min(0).max(100).default(80),
    }),
});
exports.ApplyJobSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobListingId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid Job ID format"),
        verifiedScoresSnapshot: zod_1.z.array(zod_1.z.object({
            testId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Test ID format"),
            scorePercentage: zod_1.z.number().min(0).max(100),
        })),
    }),
});
