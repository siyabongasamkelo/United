"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorialRepository = void 0;
const Tutorial_model_1 = require("./Tutorial.model");
class TutorialRepository {
    async getAllActive() {
        return await Tutorial_model_1.TutorialModel.find({ isActive: true }).lean();
    }
    async getById(id) {
        return await Tutorial_model_1.TutorialModel.findById(id).lean();
    }
    // Explicitly declare the type parameter to match the exact schema constraints
    async getByCategory(category) {
        return await Tutorial_model_1.TutorialModel.find({ category, isActive: true }).lean();
    }
}
exports.TutorialRepository = TutorialRepository;
