"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSession = void 0;
const mongoose_1 = require("mongoose");
const LiveAnswerSchema = new mongoose_1.Schema({
    questionId: { type: String, required: true },
    selectedAnswer: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
}, { _id: false });
const QuizSessionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    quizTopic: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuizTopic",
        required: true,
    },
    store: { type: mongoose_1.Schema.Types.ObjectId, ref: "Store", required: true },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch", required: true },
    status: {
        type: String,
        enum: ["IN_PROGRESS", "COMPLETED", "ABANDONED"],
        default: "IN_PROGRESS",
        index: true,
    },
    answers: { type: [LiveAnswerSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now },
}, { timestamps: true });
// Ensure a user can only have one active session per quiz topic at a time
QuizSessionSchema.index({ user: 1, quizTopic: 1, status: 1 }, { unique: true, partialFilterExpression: { status: "IN_PROGRESS" } });
exports.QuizSession = (0, mongoose_1.model)("QuizSession", QuizSessionSchema);
