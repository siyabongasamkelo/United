import { QuizRepository } from "../repositories/QuizRepository";
import {
  quizSubmissionPayloadSchema,
  QuizSubmissionInput,
} from "../validations/quizValidation";
import { IUserAnswerBreakdown } from "../models/QuizAttempt";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";
import crypto from "crypto"; // Native Node library for generating security hashes
import { Certification } from "../../certificate/models/Certification"; // Import the model
// ... keep all your existing service imports exactly the same
import { QuizSession } from "../models/QuizSession"; // Import your new model
// Add Types here at the top of src/modules/quiz/services/QuizService.ts
import { Types } from "mongoose";
import { QuizTopic, IQuizTopic } from "../models/QuizTopic";
import type { IQuizAttempt } from "../models/QuizAttempt";
// import { QuizSession } from "../models/QuizSession"; // Our new model

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
    localUserId: string,
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
      user: localUserId as any,
      store: validatedInput.storeId as any,
      branch: validatedInput.branchId as any,
      quizTopic: topic._id as any,
      score: correctCount,
      totalQuestions,
      percentageScore,
      hasPassed,
      digitalSignature: validatedInput.digitalSignature,
      breakdown: breakdownReport,
    };

    // const savedRecord = await this.quizRepo.createAttempt(attemptRecordData);

    const savedRecord = await this.quizRepo.createAttempt(attemptRecordData);

    // 🆕 DIGITAL CERTIFICATE INJECTION HOOK
    if (savedRecord.hasPassed) {
      try {
        // Generate an un-tamperable verification tracking hash signature string
        const saltString = `${localUserId}-${savedRecord._id}-${Date.now()}`;
        const verificationHash = crypto
          .createHash("sha256")
          .update(saltString)
          .digest("hex");

        await Certification.create({
          user: localUserId,
          quizAttempt: savedRecord._id,
          quizTopic: topic._id,
          verificationHash: `CERT-OHS-${verificationHash.substring(0, 12).toUpperCase()}`,
        });

        // Update telemetry parameters to inform monitors that a digital badge was locked down
        telemetry.info({
          event: "DIGITAL_COMPLIANCE_CERTIFICATE_ISSUED",
          userId: localUserId,
          topicId: topic._id,
          hash: verificationHash.substring(0, 12).toUpperCase(),
        });
      } catch (certError) {
        // Log exception safely so a glitch in the badge engine never halts quiz tracking operations
        console.error(
          "Non-blocking Certification engine exception:",
          certError,
        );
      }
    }

    // 6. Push explicit telemetry records out via your daily-rotating winston log layout
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
    // 1. Look for an ongoing session
    let session = await QuizSession.findOne({
      user: new Types.ObjectId(userId),
      quizTopic: new Types.ObjectId(topicId),
      status: "IN_PROGRESS",
    });

    // 2. If it doesn't exist, build a new session container
    if (!session) {
      session = await QuizSession.create({
        user: userId,
        quizTopic: topicId,
        store: storeId,
        branch: branchId,
        status: "IN_PROGRESS",
        answers: [],
      });
    }

    // Inside processQuizSubmission() in QuizService.ts, right after creating the QuizAttempt:
    await QuizSession.updateOne(
      {
        user: new Types.ObjectId(userId),
        quizTopic: topicId,
        status: "IN_PROGRESS",
      },
      { $set: { status: "COMPLETED" } },
    );

    return session;
  }

  async updateLiveAnswer(
    userId: string,
    topicId: string,
    questionId: string,
    selectedAnswer: string,
  ) {
    // Dynamically insert or update a specific answer index in our live array
    const session = await QuizSession.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
        quizTopic: new Types.ObjectId(topicId),
        status: "IN_PROGRESS",
      },
      {
        $set: { lastActiveAt: new Date() },
      },
      { new: true },
    );

    if (!session) {
      throw createAppError(
        "No active quiz session found to record progress.",
        404,
      );
    }

    // Check if the question was already answered previously in the session
    const existingAnswerIndex = session.answers.findIndex(
      (a) => a.questionId === questionId,
    );

    if (existingAnswerIndex > -1) {
      session.answers[existingAnswerIndex].selectedAnswer = selectedAnswer
        .toUpperCase()
        .trim();
      session.answers[existingAnswerIndex].updatedAt = new Date();
    } else {
      session.answers.push({
        questionId,
        selectedAnswer: selectedAnswer.toUpperCase().trim(),
        updatedAt: new Date(),
      });
    }

    await session.save();
    return session;
  }
}
