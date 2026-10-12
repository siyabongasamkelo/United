"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Job_controller_1 = require("./Job.controller");
const router = (0, express_1.Router)();
const controller = new Job_controller_1.JobController();
// Workers look at jobs & companies manage them
router.post("/listings", controller.createListing);
router.get("/listings", controller.getActiveListings);
router.post("/apply", controller.submitApplication);
router.get("/listings/:id/applicants", controller.getJobApplicants);
exports.default = router;
