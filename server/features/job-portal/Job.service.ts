import { JobListingRepository } from "./repositories/JobListing.repository";
import { JobApplicationRepository } from "./repositories/JobApplication.repository";

export class JobService {
  private jobListingRepo = new JobListingRepository();
  private jobApplicationRepo = new JobApplicationRepository();

  async postNewVacancy(companyId: string, payload: any) {
    return await this.jobListingRepo.createJob({
      ...payload,
      companyId,
    });
  }

  async getActiveFeeds() {
    return await this.jobListingRepo.getAllActive();
  }

  async processApplication(
    userId: string,
    jobListingId: string,
    scores: any[],
  ) {
    const job = await this.jobListingRepo.getById(jobListingId);
    if (!job) throw new Error("Target job listing does not exist");

    // Business Logic Rule: Check if worker meets required thresholds
    if (job.requiredCertifications.length > 0) {
      job.requiredCertifications.forEach((certId) => {
        const matchingCert = scores.find((s) => s.testId === certId.toString());
        if (
          !matchingCert ||
          matchingCert.scorePercentage < job.minPassingScoreRequired
        ) {
          throw new Error(
            "You do not meet the minimum certification scores required for this position",
          );
        }
      });
    }

    return await this.jobApplicationRepo.apply({
      jobListingId: job._id,
      applicantId: userId,
      verifiedScoresSnapshot: scores,
    });
  }

  async listCandidatesForJob(jobId: string) {
    return await this.jobApplicationRepo.getApplicantsForJob(jobId);
  }
}
