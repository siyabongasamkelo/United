"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const JobListing_repository_1 = require("./repositories/JobListing.repository");
const JobApplication_repository_1 = require("./repositories/JobApplication.repository");
class JobService {
    jobListingRepo = new JobListing_repository_1.JobListingRepository();
    jobApplicationRepo = new JobApplication_repository_1.JobApplicationRepository();
    async postNewVacancy(companyId, payload) {
        return await this.jobListingRepo.createJob({
            ...payload,
            companyId,
        });
    }
    async getActiveFeeds() {
        return await this.jobListingRepo.getAllActive();
    }
    async processApplication(userId, jobListingId, scores) {
        const job = await this.jobListingRepo.getById(jobListingId);
        if (!job)
            throw new Error("Target job listing does not exist");
        // Business Logic Rule: Check if worker meets required thresholds
        if (job.requiredCertifications.length > 0) {
            job.requiredCertifications.forEach((certId) => {
                const matchingCert = scores.find((s) => s.testId === certId.toString());
                if (!matchingCert ||
                    matchingCert.scorePercentage < job.minPassingScoreRequired) {
                    throw new Error("You do not meet the minimum certification scores required for this position");
                }
            });
        }
        return await this.jobApplicationRepo.apply({
            jobListingId: job._id,
            applicantId: userId,
            verifiedScoresSnapshot: scores,
        });
    }
    async listCandidatesForJob(jobId) {
        return await this.jobApplicationRepo.getApplicantsForJob(jobId);
    }
}
exports.JobService = JobService;
