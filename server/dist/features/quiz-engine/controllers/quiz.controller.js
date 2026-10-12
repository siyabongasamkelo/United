"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const quiz_service_js_1 = require("../services/quiz.service.js");
const quiz_dto_js_1 = require("../dtos/quiz.dto.js");
const quizService = new quiz_service_js_1.QuizService();
class QuizController {
    async startSession(req, res, next) {
        try {
            const { userId, quizId } = req.body;
            const session = await quizService.startQuizAttempt(userId, quizId);
            res.status(201).json({
                success: true,
                message: "Quiz session configured successfully.",
                data: quiz_dto_js_1.QuizDTO.toSessionClient(session),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async saveAnswer(req, res, next) {
        try {
            // 🛠️ Force typecast to string since Zod already verified it is a valid single route parameter string
            const sessionId = req.params.sessionId;
            const { questionId, selectedOptions, timeSpentSeconds } = req.body;
            const updatedSession = await quizService.logAnswerAndAdvance(sessionId, questionId, selectedOptions, timeSpentSeconds);
            res.status(200).json({
                success: true,
                message: "Progress snapshot stored accurately.",
                data: quiz_dto_js_1.QuizDTO.toSessionClient(updatedSession),
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.QuizController = QuizController;
