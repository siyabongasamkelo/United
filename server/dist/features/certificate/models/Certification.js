"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certification = void 0;
const mongoose_1 = require("mongoose");
const CertificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    quizAttempt: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuizAttempt",
        required: true,
    },
    quizTopic: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuizTopic",
        required: true,
        index: true,
    },
    dateEarned: { type: Date, required: true, default: Date.now },
    verificationHash: { type: String, required: true, unique: true },
}, { timestamps: true });
exports.Certification = (0, mongoose_1.model)("Certification", CertificationSchema);
