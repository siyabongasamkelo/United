import { QuizRepository } from "../repositories/QuizRepository";
import {
  quizSubmissionPayloadSchema,
  QuizSubmissionInput,
} from "../validations/quizValidation";
import { IQuizAttempt, IUserAnswerBreakdown } from "../models/QuizAttempt";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";

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

    const savedRecord = await this.quizRepo.createAttempt(attemptRecordData);

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
}
