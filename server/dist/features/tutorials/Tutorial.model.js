"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorialModel = void 0;
const mongoose_1 = require("mongoose");
const TutorialStepSchema = new mongoose_1.Schema({
    timestamp: { type: Number, required: true }, // in seconds
    instructionTitle: { type: String, required: true },
    instructionBody: { type: String, required: true },
});
const TutorialSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: ["ROPE_TYING", "PASSAGE_NAVIGATION", "EQUIPMENT_SAFETY"],
        required: true,
    },
    videoUrl: { type: String, required: true },
    durationInSeconds: { type: Number, required: true },
    steps: [TutorialStepSchema],
    associatedTestId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Test" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.TutorialModel = (0, mongoose_1.model)("Tutorial", TutorialSchema);
