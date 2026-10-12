"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const Job_service_1 = require("./Job.service");
class JobController {
    jobService = new Job_service_1.JobService();
    createListing = async (req, res) => {
        try {
            const companyId = req.headers["x-company-id"] || "650c1f2e1c9d440000000099";
            const data = await this.jobService.postNewVacancy(companyId, req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
    getActiveListings = async (req, res) => {
        try {
            const data = await this.jobService.getActiveFeeds();
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };
    submitApplication = async (req, res) => {
        try {
            const userId = req.headers["x-user-id"] || "650c1f2e1c9d440000000055";
            const { jobListingId, verifiedScoresSnapshot } = req.body;
            const data = await this.jobService.processApplication(userId, jobListingId, verifiedScoresSnapshot);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
    getJobApplicants = async (req, res) => {
        try {
            const data = await this.jobService.listCandidatesForJob(req.params.id);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    };
}
exports.JobController = JobController;
