"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const QuizRepository_1 = require("../repositories/QuizRepository");
const quizValidation_1 = require("../validations/quizValidation");
const errorMiddleware_1 = require("../../../shared/middleware/errorMiddleware");
const logger_1 = require("../../../shared/telemetry/logger");
const crypto_1 = __importDefault(require("crypto"));
const Certification_1 = require("../../certificate/models/Certification");
const QuizSession_1 = require("../models/QuizSession");
const mongoose_1 = require("mongoose");
class QuizService {
    quizRepo;
    constructor() {
        this.quizRepo = new QuizRepository_1.QuizRepository();
    }
    async getActiveQuestionnaires() {
        return await this.quizRepo.findActiveTopics();
    }
    async processQuizSubmission(payload, localUserId) {
        const startTime = performance.now();
        // 1. Structural schema checking using your Zod definitions
        const validatedInput = quizValidation_1.quizSubmissionPayloadSchema.parse(payload);
        // 2. Fetch target quiz context details out of storage
        const topic = await this.quizRepo.findTopicById(validatedInput.quizTopicId);
        if (!topic || !topic.isActive) {
            throw (0, errorMiddleware_1.createAppError)("The requested safety training questionnaire is unavailable or archived.", 404);
        }
        let correctCount = 0;
        const breakdownReport = [];
        // 3. Process every question server-side to calculate raw scores securely
        for (const question of topic.questions) {
            const userSubmission = validatedInput.answers.find((a) => a.questionId === question.questionId);
            const selected = userSubmission
                ? userSubmission.selectedAnswer
                : "UNANSWERED";
            const isCorrect = selected === question.correctAnswer;
            if (isCorrect) {
                correctCount++;
            }
            breakdownReport.push({
                questionId: question.questionId,
                questionText: question.questionText,
                selectedAnswer: selected,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation,
            });
        }
        // 4. Score Math & Legal Boundary Computations
        const totalQuestions = topic.questions.length;
        const percentageScore = Math.round((correctCount / totalQuestions) * 100);
        const hasPassed = percentageScore >= topic.passingScorePercentage;
        // 5. Compile the comprehensive attempt dataset mapping back to your models
        const attemptRecordData = {
            user: new mongoose_1.Types.ObjectId(localUserId), // ✅ Force conversion to pure ObjectId for schema reference validation
            store: new mongoose_1.Types.ObjectId(validatedInput.storeId), // ✅ Ensure matching ObjectId shape
            branch: new mongoose_1.Types.ObjectId(validatedInput.branchId), // ✅ Ensure matching ObjectId shape
            quizTopic: topic._id,
            score: correctCount,
            totalQuestions,
            percentageScore,
            hasPassed,
            digitalSignature: validatedInput.digitalSignature,
            breakdown: breakdownReport,
        };
        const savedRecord = await this.quizRepo.createAttempt(attemptRecordData);
        // ✅ Cleanly close out the live quiz session right here after saving the final attempt log
        await QuizSession_1.QuizSession.updateOne({
            user: new mongoose_1.Types.ObjectId(localUserId),
            quizTopic: topic._id,
            status: "IN_PROGRESS",
        }, { $set: { status: "COMPLETED" } });
        // 🆕 DIGITAL CERTIFICATE INJECTION HOOK
        if (savedRecord.hasPassed) {
            try {
                const saltString = `${localUserId}-${savedRecord._id}-${Date.now()}`;
                const verificationHash = crypto_1.default
                    .createHash("sha256")
                    .update(saltString)
                    .digest("hex");
                // ✅ Confirmed match with Certification model expectations!
                await Certification_1.Certification.create({
                    user: new mongoose_1.Types.ObjectId(localUserId),
                    quizAttempt: savedRecord._id,
                    quizTopic: topic._id,
                    verificationHash: `CERT-OHS-${verificationHash.substring(0, 12).toUpperCase()}`,
                });
                logger_1.telemetry.info({
                    event: "DIGITAL_COMPLIANCE_CERTIFICATE_ISSUED",
                    userId: localUserId,
                    topicId: topic._id,
                    hash: verificationHash.substring(0, 12).toUpperCase(),
                });
            }
            catch (certError) {
                // Safe logging trace so errors are visible in development terminals
                console.error("Non-blocking Certification engine exception:", certError);
            }
        }
        logger_1.telemetry.info({
            event: "SAFETY_QUIZ_COMPLETED",
            attemptId: savedRecord._id,
            userId: localUserId,
            topicId: topic._id,
            branchId: validatedInput.branchId,
            score: `${correctCount}/${totalQuestions}`,
            percentage: percentageScore,
            hasPassed,
            durationMs: Math.round(performance.now() - startTime),
        });
        return savedRecord;
    }
    async fetchPersonalLogs(userId) {
        return await this.quizRepo.findAttemptsByUser(userId);
    }
    async fetchBranchStats(branchId) {
        return await this.quizRepo.getComplianceStatsByBranch(branchId);
    }
    async initializeOrResumeSession(userId, topicId, storeId, branchId) {
        let session = await QuizSession_1.QuizSession.findOne({
            user: new mongoose_1.Types.ObjectId(userId),
            quizTopic: new mongoose_1.Types.ObjectId(topicId),
            status: "IN_PROGRESS",
        });
        if (!session) {
            session = await QuizSession_1.QuizSession.create({
                user: new mongoose_1.Types.ObjectId(userId),
                quizTopic: new mongoose_1.Types.ObjectId(topicId),
                store: new mongoose_1.Types.ObjectId(storeId),
                branch: new mongoose_1.Types.ObjectId(branchId),
                status: "IN_PROGRESS",
                answers: [],
            });
        }
        return session;
    }
    async updateLiveAnswer(userId, topicId, questionId, selectedAnswer) {
        const session = await QuizSession_1.QuizSession.findOne({
            user: new mongoose_1.Types.ObjectId(userId),
            quizTopic: new mongoose_1.Types.ObjectId(topicId),
            status: "IN_PROGRESS",
        });
        if (!session) {
            throw (0, errorMiddleware_1.createAppError)("No active quiz session found to record progress.", 404);
        }
        session.lastActiveAt = new Date();
        const existingAnswerIndex = session.answers.findIndex((a) => a.questionId === questionId);
        const formattedAnswer = selectedAnswer.toUpperCase().trim();
        if (existingAnswerIndex > -1) {
            session.answers[existingAnswerIndex].selectedAnswer = formattedAnswer;
            session.answers[existingAnswerIndex].updatedAt = new Date();
        }
        else {
            session.answers.push({
                questionId,
                selectedAnswer: formattedAnswer,
                updatedAt: new Date(),
            });
        }
        await session.save();
        return session;
    }
}
exports.QuizService = QuizService;
