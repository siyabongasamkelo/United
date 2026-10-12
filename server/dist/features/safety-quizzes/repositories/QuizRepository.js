"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRepository = void 0;
const QuizTopic_1 = require("../models/QuizTopic");
const QuizAttempt_1 = require("../models/QuizAttempt");
const mongoose_1 = require("mongoose");
class QuizRepository {
    async findActiveTopics() {
        // Select everything except the correct answers for raw delivery list visualization
        return await QuizTopic_1.QuizTopic.find({ isActive: true }).select("-questions.correctAnswer");
    }
    async findTopicById(id) {
        return await QuizTopic_1.QuizTopic.findById(id);
    }
    async createAttempt(attemptData) {
        const attempt = new QuizAttempt_1.QuizAttempt(attemptData);
        return await attempt.save();
    }
    async findAttemptsByUser(userId) {
        return await QuizAttempt_1.QuizAttempt.find({ user: new mongoose_1.Types.ObjectId(userId) })
            .populate("quizTopic", "title hazardLevel")
            .sort({ attemptDate: -1 });
    }
    // Administrative metric tool aggregation query for your supervisor dashboard screens
    async getComplianceStatsByBranch(branchId) {
        return await QuizAttempt_1.QuizAttempt.aggregate([
            { $match: { branch: new mongoose_1.Types.ObjectId(branchId) } },
            {
                $group: {
                    _id: "$hasPassed",
                    count: { $sum: 1 },
                    avgScore: { $avg: "$percentageScore" },
                },
            },
        ]);
    }
}
exports.QuizRepository = QuizRepository;
