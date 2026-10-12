"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const QuizService_1 = require("../services/QuizService");
class QuizController {
    quizService;
    constructor() {
        this.quizService = new QuizService_1.QuizService();
    }
    getAvailableQuizzes = async (req, res, next) => {
        try {
            const result = await this.quizService.getActiveQuestionnaires();
            res
                .status(200)
                .json({ success: true, count: result.length, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    submitAnswers = async (req, res, next) => {
        try {
            // Pull user contextual indices securely out of your hydration middleware pipeline profile
            const localUserId = req.user?._id;
            const result = await this.quizService.processQuizSubmission(req.body, String(localUserId));
            res.status(201).json({
                success: true,
                message: result.hasPassed
                    ? "Training module passed and digital safety signature logged successfully."
                    : "Quiz complete. Minimum passing legal threshold not met.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getHistoryLogs = async (req, res, next) => {
        try {
            const localUserId = req.user?._id;
            const result = await this.quizService.fetchPersonalLogs(String(localUserId));
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    getBranchMetrics = async (req, res, next) => {
        try {
            const branchId = req.query.branchId;
            const result = await this.quizService.fetchBranchStats(branchId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    // Add these methods inside your QuizController class in File 1
    startQuizSession = async (req, res, next) => {
        try {
            const localUserId = req.user?._id;
            const { quizTopicId, storeId, branchId } = req.body;
            const session = await this.quizService.initializeOrResumeSession(String(localUserId), quizTopicId, storeId, branchId);
            res.status(200).json({ success: true, data: session });
        }
        catch (error) {
            next(error);
        }
    };
    saveLiveAnswer = async (req, res, next) => {
        try {
            const localUserId = req.user?._id;
            const { quizTopicId, questionId, selectedAnswer } = req.body;
            const session = await this.quizService.updateLiveAnswer(String(localUserId), quizTopicId, questionId, selectedAnswer);
            res.status(200).json({ success: true, data: session });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.QuizController = QuizController;
