"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationRepository = void 0;
const mongoose_1 = require("mongoose");
const JobApplicationSchema = new mongoose_1.Schema({
    jobListingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "JobListing",
        required: true,
    },
    applicantId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: [
            "APPLIED",
            "REVIEWING",
            "INTERVIEW_SCHEDULED",
            "HIRED",
            "REJECTED",
        ],
        default: "APPLIED",
    },
    verifiedScoresSnapshot: [
        {
            testId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Test" },
            scorePercentage: { type: Number },
        },
    ],
}, { timestamps: true });
const JobApplicationModel = (0, mongoose_1.model)("JobApplication", JobApplicationSchema);
class JobApplicationRepository {
    // Atomic generation of job application entry
    async apply(payload) {
        return await JobApplicationModel.create(payload);
    }
    // Pulls applications for a job listing so company management can review candidates
    async getApplicantsForJob(jobId) {
        return await JobApplicationModel.find({ jobListingId: jobId })
            .populate("applicantId", "firstName lastName email profilePicture")
            .sort({ "verifiedScoresSnapshot.scorePercentage": -1 }) // 👈 Automatically sorts by best performers!
            .lean();
    }
}
exports.JobApplicationRepository = JobApplicationRepository;
