import { JobListingModel, IJobListing } from "./Job.model";
import { Types } from "mongoose";

export class JobListingRepository {
  // Fetch listings where status is active
  async getAllActive(): Promise<IJobListing[]> {
    return await JobListingModel.find({ status: "ACTIVE" })
      .populate("companyId", "name logo")
      .lean();
  }

  // Fetch single job configuration details
  async getById(id: string): Promise<IJobListing | null> {
    return await JobListingModel.findById(id).lean();
  }

  // Create a brand new corporate opening vacancy
  async createJob(jobData: Partial<IJobListing>): Promise<IJobListing> {
    return await JobListingModel.create(jobData);
  }
}
