"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRepository = void 0;
const quiz_model_js_1 = require("../models/quiz.model.js");
class QuizRepository {
    async findQuizById(quizId) {
        return quiz_model_js_1.Quiz.findById(quizId);
    }
    async findSessionById(sessionId) {
        return quiz_model_js_1.QuizSession.findById(sessionId);
    }
    async createSession(data) {
        return quiz_model_js_1.QuizSession.create(data);
    }
    async saveSession(session) {
        return session.save();
    }
    async findActiveUserSession(userId, quizId) {
        return quiz_model_js_1.QuizSession.findOne({ userId, quizId, status: "active" });
    }
}
exports.QuizRepository = QuizRepository;
