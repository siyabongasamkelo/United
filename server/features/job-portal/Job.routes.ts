import { Router } from "express";
import { JobController } from "./Job.controller";

const router = Router();
const controller = new JobController();

// Workers look at jobs & companies manage them
router.post("/listings", controller.createListing);
router.get("/listings", controller.getActiveListings);
router.post("/apply", controller.submitApplication);
router.get("/listings/:id/applicants", controller.getJobApplicants);

export default router;
