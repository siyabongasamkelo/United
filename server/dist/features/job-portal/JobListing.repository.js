"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobListingRepository = void 0;
const Job_model_1 = require("./Job.model");
class JobListingRepository {
    // Fetch listings where status is active
    async getAllActive() {
        return await Job_model_1.JobListingModel.find({ status: "ACTIVE" })
            .populate("companyId", "name logo")
            .lean();
    }
    // Fetch single job configuration details
    async getById(id) {
        return await Job_model_1.JobListingModel.findById(id).lean();
    }
    // Create a brand new corporate opening vacancy
    async createJob(jobData) {
        return await Job_model_1.JobListingModel.create(jobData);
    }
}
exports.JobListingRepository = JobListingRepository;
