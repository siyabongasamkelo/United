"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorialService = void 0;
const Tutorial_repository_1 = require("./Tutorial.repository");
class TutorialService {
    tutorialRepo = new Tutorial_repository_1.TutorialRepository();
    async listAvailableTutorials() {
        return await this.tutorialRepo.getAllActive();
    }
    async getTutorialDetails(id) {
        const tutorial = await this.tutorialRepo.getById(id);
        if (!tutorial)
            throw new Error("Requested training demonstration not found");
        return tutorial;
    }
}
exports.TutorialService = TutorialService;
