"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Tutorial_controller_1 = require("./Tutorial.controller");
const router = (0, express_1.Router)();
const controller = new Tutorial_controller_1.TutorialController();
router.get("/", controller.getAllTutorials);
router.get("/:id", controller.getTutorialById);
exports.default = router;
