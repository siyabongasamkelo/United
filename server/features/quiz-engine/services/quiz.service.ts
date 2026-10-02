import { QuizRepository } from "../repositories/quiz.repository.js";
import {
  IQuizSession,
  IUserResponse,
  IQuestion,
} from "../models/quiz.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import logger from "../../../utils/logger.js";
import mongoose from "mongoose";

const quizRepo = new QuizRepository();

export class QuizService {
  async startQuizAttempt(
    userId: string,
    quizId: string,
  ): Promise<IQuizSession> {
    logger.info(`Starting quiz attempt. User: ${userId}, Quiz: ${quizId}`);

    const quiz = await quizRepo.findQuizById(quizId);
    if (!quiz) throw new ApiError(404, "Requested Quiz topic not found.");

    const existingSession = await quizRepo.findActiveUserSession(
      userId,
      quizId,
    );
    if (existingSession) {
      logger.info(`Resuming existing session for User: ${userId}`);
      return existingSession; // Drop-in resume logic automatically handles crash protection
    }

    if (!quiz.chapters.length || !quiz.chapters[0].questions.length) {
      throw new ApiError(
        400,
        "This quiz topic does not contain chapters or questions yet.",
      );
    }

    const firstChapter = quiz.chapters[0];
    const firstQuestion = firstChapter.questions[0];
    const expiresAt = new Date(Date.now() + quiz.timeLimitMinutes * 60 * 1000); // Strict global countdown

    return quizRepo.createSession({
      userId,
      quizId: quiz._id as mongoose.Types.ObjectId,
      status: "active",
      currentChapterId: firstChapter._id,
      currentQuestionId: firstQuestion._id,
      currentIndex: 0,
      expiresAt,
      responses: [],
    });
  }

  async logAnswerAndAdvance(
    sessionId: string,
    questionId: string,
    selectedOptions: string[],
    timeSpentSeconds: number,
  ): Promise<IQuizSession> {
    const session = await quizRepo.findSessionById(sessionId);
    if (!session)
      throw new ApiError(404, "Quiz session tracking profile not found.");

    if (session.status !== "active") {
      throw new ApiError(
        400,
        `Cannot submit answer. Session is already closed with status: ${session.status}`,
      );
    }

    // ⏱️ Server-Side Time Enforcement Lock
    if (new Date() > session.expiresAt) {
      session.status = "timed_out";
      await quizRepo.saveSession(session);
      logger.warn(
        `Session ${sessionId} timed out during live submit operation.`,
      );
      throw new ApiError(
        403,
        "Time limit exceeded. This test session has timed out.",
      );
    }

    const quiz = await quizRepo.findQuizById(session.quizId.toString());
    if (!quiz) throw new ApiError(404, "Quiz template detached from session.");

    // Flatten all chapters to build a progressive linear question matrix
    const flatQuestions: { question: IQuestion; chapterId: string }[] = [];
    quiz.chapters.forEach((ch) => {
      ch.questions.forEach((q) =>
        flatQuestions.push({ question: q, chapterId: ch._id }),
      );
    });

    const currentPosition = flatQuestions.findIndex(
      (fq) => fq.question._id.toString() === questionId,
    );
    if (currentPosition === -1)
      throw new ApiError(400, "Question out of scope for this quiz blueprint.");

    // Save answer into array sub-document log
    const responseIndex = session.responses.findIndex(
      (r) => r.questionId.toString() === questionId,
    );
    const answerData: IUserResponse = {
      questionId: new mongoose.Types.ObjectId(questionId),
      selectedOptions,
      timeSpentSeconds,
      answeredAt: new Date(),
    };

    if (responseIndex > -1) {
      session.responses[responseIndex] = answerData; // Overwrite if they re-answer
    } else {
      session.responses.push(answerData);
    }

    // 📖 Advanced Chapter & Pointer Shifting Matrix
    if (currentPosition + 1 < flatQuestions.length) {
      const nextItem = flatQuestions[currentPosition + 1];
      session.currentIndex = currentPosition + 1;
      session.currentQuestionId = nextItem.question._id;
      session.currentChapterId = nextItem.chapterId;
      logger.info(
        `Session progress logged. User moving to index ${session.currentIndex}`,
      );
    } else {
      // Reached the end of the final chapter. Trigger Grading calculation Loop!
      logger.info(
        `Final question recorded for session ${sessionId}. Running grading loop.`,
      );
      this.evaluateAndCloseSession(
        session,
        flatQuestions.map((fq) => fq.question),
      );
    }

    return quizRepo.saveSession(session);
  }

  private evaluateAndCloseSession(
    session: IQuizSession,
    questions: IQuestion[],
  ): void {
    let earnedPoints = 0;

    session.responses.forEach((response) => {
      const originalQuestion = questions.find(
        (q) => q._id.toString() === response.questionId.toString(),
      );
      if (originalQuestion) {
        // Direct answer matching calculation (Anti-cheat safe)
        const isCorrect =
          originalQuestion.correctAnswers.length ===
            response.selectedOptions.length &&
          originalQuestion.correctAnswers.every((opt) =>
            response.selectedOptions.includes(opt),
          );

        response.isCorrect = isCorrect;
        if (isCorrect) earnedPoints += originalQuestion.points;
      }
    });

    session.finalScore = earnedPoints;
    session.status = "completed";
    session.completedAt = new Date();
  }
}
