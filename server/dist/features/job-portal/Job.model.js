"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobListingModel = void 0;
const mongoose_1 = require("mongoose");
const JobListingSchema = new mongoose_1.Schema({
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: {
        type: String,
        enum: ["FULL_TIME", "PART_TIME", "CASUAL", "CONTRACT"],
        required: true,
    },
    salaryRange: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        currency: { type: String, default: "USD" },
        rate: { type: String, enum: ["HOURLY", "ANNUAL"], required: true },
    },
    requiredCertifications: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Test" }],
    minPassingScoreRequired: { type: Number, default: 80 },
    status: {
        type: String,
        enum: ["DRAFT", "ACTIVE", "CLOSED"],
        default: "ACTIVE",
    },
}, { timestamps: true });
exports.JobListingModel = (0, mongoose_1.model)("JobListing", JobListingSchema);
