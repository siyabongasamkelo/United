"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAttempt = void 0;
const mongoose_1 = require("mongoose");
const UserAnswerBreakdownSchema = new mongoose_1.Schema({
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    selectedAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    explanation: { type: String, required: true },
}, { _id: false });
const QuizAttemptSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    store: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
        index: true,
    },
    branch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true,
    },
    quizTopic: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuizTopic",
        required: true,
        index: true,
    },
    attemptDate: { type: Date, required: true, default: Date.now },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentageScore: { type: Number, required: true },
    hasPassed: { type: Boolean, required: true, index: true },
    digitalSignature: { type: String, required: true }, // Absolute legal enforcement constraint
    breakdown: { type: [UserAnswerBreakdownSchema], required: true },
}, { timestamps: true });
exports.QuizAttempt = (0, mongoose_1.model)("QuizAttempt", QuizAttemptSchema);
