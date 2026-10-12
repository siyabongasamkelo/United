"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorialController = void 0;
const Tutorial_service_1 = require("./Tutorial.service");
class TutorialController {
    tutorialService = new Tutorial_service_1.TutorialService();
    getAllTutorials = async (req, res) => {
        try {
            const data = await this.tutorialService.listAvailableTutorials();
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };
    getTutorialById = async (req, res) => {
        try {
            const { id } = req.params;
            const data = await this.tutorialService.getTutorialDetails(id);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    };
}
exports.TutorialController = TutorialController;
