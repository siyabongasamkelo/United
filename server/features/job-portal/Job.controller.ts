import { Request, Response } from "express";
import { JobService } from "./Job.service";

export class JobController {
  private jobService = new JobService();

  createListing = async (req: Request, res: Response): Promise<void> => {
    try {
      const companyId =
        (req.headers["x-company-id"] as string) || "650c1f2e1c9d440000000099";
      const data = await this.jobService.postNewVacancy(companyId, req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getActiveListings = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.jobService.getActiveFeeds();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  submitApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId =
        (req.headers["x-user-id"] as string) || "650c1f2e1c9d440000000055";
      const { jobListingId, verifiedScoresSnapshot } = req.body;
      const data = await this.jobService.processApplication(
        userId,
        jobListingId,
        verifiedScoresSnapshot,
      );
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getJobApplicants = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.jobService.listCandidatesForJob(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}
