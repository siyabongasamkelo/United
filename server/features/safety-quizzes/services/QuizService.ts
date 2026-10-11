import { QuizRepository } from "../repositories/QuizRepository";
import {
  quizSubmissionPayloadSchema,
  QuizSubmissionInput,
} from "../validations/quizValidation";
import { IUserAnswerBreakdown } from "../models/QuizAttempt";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";
import crypto from "crypto";
import { Certification } from "../../certificate/models/Certification";
import { QuizSession } from "../models/QuizSession";
import { Types } from "mongoose";
import type { IQuizAttempt } from "../models/QuizAttempt";

export class QuizService {
  private quizRepo: QuizRepository;

  constructor() {
    this.quizRepo = new QuizRepository();
  }

  async getActiveQuestionnaires() {
    return await this.quizRepo.findActiveTopics();
  }

  async processQuizSubmission(
    payload: unknown,
    localUserId: string, // This is passed as String(req.user?._id) from Controller
  ): Promise<IQuizAttempt> {
    const startTime = performance.now();

    // 1. Structural schema checking using your Zod definitions
    const validatedInput: QuizSubmissionInput =
      quizSubmissionPayloadSchema.parse(payload);

    // 2. Fetch target quiz context details out of storage
    const topic = await this.quizRepo.findTopicById(validatedInput.quizTopicId);
    if (!topic || !topic.isActive) {
      throw createAppError(
        "The requested safety training questionnaire is unavailable or archived.",
        404,
      );
    }

    let correctCount = 0;
    const breakdownReport: IUserAnswerBreakdown[] = [];

    // 3. Process every question server-side to calculate raw scores securely
    for (const question of topic.questions) {
      const userSubmission = validatedInput.answers.find(
        (a) => a.questionId === question.questionId,
      );
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
    const attemptRecordData: Partial<IQuizAttempt> = {
      user: new Types.ObjectId(localUserId), // ✅ Force conversion to pure ObjectId for schema reference validation
      store: new Types.ObjectId(validatedInput.storeId), // ✅ Ensure matching ObjectId shape
      branch: new Types.ObjectId(validatedInput.branchId), // ✅ Ensure matching ObjectId shape
      quizTopic: topic._id as any,
      score: correctCount,
      totalQuestions,
      percentageScore,
      hasPassed,
      digitalSignature: validatedInput.digitalSignature,
      breakdown: breakdownReport,
    };

    const savedRecord = await this.quizRepo.createAttempt(attemptRecordData);

    // ✅ Cleanly close out the live quiz session right here after saving the final attempt log
    await QuizSession.updateOne(
      {
        user: new Types.ObjectId(localUserId),
        quizTopic: topic._id,
        status: "IN_PROGRESS",
      },
      { $set: { status: "COMPLETED" } },
    );

    // 🆕 DIGITAL CERTIFICATE INJECTION HOOK
    if (savedRecord.hasPassed) {
      try {
        const saltString = `${localUserId}-${savedRecord._id}-${Date.now()}`;
        const verificationHash = crypto
          .createHash("sha256")
          .update(saltString)
          .digest("hex");

        // ✅ Confirmed match with Certification model expectations!
        await Certification.create({
          user: new Types.ObjectId(localUserId),
          quizAttempt: savedRecord._id,
          quizTopic: topic._id,
          verificationHash: `CERT-OHS-${verificationHash.substring(0, 12).toUpperCase()}`,
        });

        telemetry.info({
          event: "DIGITAL_COMPLIANCE_CERTIFICATE_ISSUED",
          userId: localUserId,
          topicId: topic._id,
          hash: verificationHash.substring(0, 12).toUpperCase(),
        });
      } catch (certError) {
        // Safe logging trace so errors are visible in development terminals
        console.error(
          "Non-blocking Certification engine exception:",
          certError,
        );
      }
    }

    telemetry.info({
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

  async fetchPersonalLogs(userId: string) {
    return await this.quizRepo.findAttemptsByUser(userId);
  }

  async fetchBranchStats(branchId: string) {
    return await this.quizRepo.getComplianceStatsByBranch(branchId);
  }

  async initializeOrResumeSession(
    userId: string,
    topicId: string,
    storeId: string,
    branchId: string,
  ) {
    let session = await QuizSession.findOne({
      user: new Types.ObjectId(userId),
      quizTopic: new Types.ObjectId(topicId),
      status: "IN_PROGRESS",
    });

    if (!session) {
      session = await QuizSession.create({
        user: new Types.ObjectId(userId),
        quizTopic: new Types.ObjectId(topicId),
        store: new Types.ObjectId(storeId),
        branch: new Types.ObjectId(branchId),
        status: "IN_PROGRESS",
        answers: [],
      });
    }

    return session;
  }

  async updateLiveAnswer(
    userId: string,
    topicId: string,
    questionId: string,
    selectedAnswer: string,
  ) {
    const session = await QuizSession.findOne({
      user: new Types.ObjectId(userId),
      quizTopic: new Types.ObjectId(topicId),
      status: "IN_PROGRESS",
    });

    if (!session) {
      throw createAppError(
        "No active quiz session found to record progress.",
        404,
      );
    }

    session.lastActiveAt = new Date();

    const existingAnswerIndex = session.answers.findIndex(
      (a) => a.questionId === questionId,
    );

    const formattedAnswer = selectedAnswer.toUpperCase().trim();

    if (existingAnswerIndex > -1) {
      session.answers[existingAnswerIndex].selectedAnswer = formattedAnswer;
      session.answers[existingAnswerIndex].updatedAt = new Date();
    } else {
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
