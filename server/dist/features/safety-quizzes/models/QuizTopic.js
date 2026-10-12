"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizTopic = void 0;
const mongoose_1 = require("mongoose");
const QuizQuestionSchema = new mongoose_1.Schema({
    questionId: { type: String, required: true },
    questionText: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    correctAnswer: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    explanation: { type: String, required: true, trim: true },
}, { _id: false });
const QuizTopicSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    hazardLevel: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        required: true,
        default: "LOW",
    },
    passingScorePercentage: {
        type: Number,
        required: true,
        default: 80,
        min: 0,
        max: 100,
    },
    questions: { type: [QuizQuestionSchema], required: true },
    isActive: { type: Boolean, required: true, default: true },
}, { timestamps: true });
exports.QuizTopic = (0, mongoose_1.model)("QuizTopic", QuizTopicSchema);
