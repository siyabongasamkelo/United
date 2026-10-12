"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSession = exports.Quiz = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const QuestionSchema = new mongoose_1.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswers: [{ type: String, required: true }],
    points: { type: Number, default: 1 },
});
const ChapterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    questions: [QuestionSchema], // Sub-document nesting
});
const QuizSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true, index: true },
    timeLimitMinutes: { type: Number, required: true },
    chapters: [ChapterSchema],
}, { timestamps: true });
exports.Quiz = mongoose_1.default.model("Feat_Quiz_Master", QuizSchema);
const UserResponseSchema = new mongoose_1.Schema({
    questionId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    selectedOptions: [{ type: String, required: true }],
    timeSpentSeconds: { type: Number, required: true },
    isCorrect: { type: Boolean },
    answeredAt: { type: Date, default: Date.now },
});
const QuizSessionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Feat_Quiz_Master",
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "completed", "timed_out"],
        default: "active",
    },
    currentChapterId: { type: String, required: true },
    currentQuestionId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    currentIndex: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    responses: [UserResponseSchema], // Nested array log for answer-by-answer tracking
    finalScore: { type: Number, default: 0 },
    completedAt: { type: Date },
}, { timestamps: true });
// Prevent duplicate active attempts for safety
QuizSessionSchema.index({ userId: 1, quizId: 1, status: 1 });
exports.QuizSession = mongoose_1.default.model("Feat_Quiz_Session", QuizSessionSchema);
