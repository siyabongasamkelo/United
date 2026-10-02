import { Request, Response, NextFunction } from "express";
import { QuizService } from "../services/quiz.service.js";
import { QuizDTO } from "../dtos/quiz.dto.js";
import logger from "../../../utils/logger.js";

const quizService = new QuizService();

export class QuizController {
  async startSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, quizId } = req.body;
      const session = await quizService.startQuizAttempt(userId, quizId);

      res.status(201).json({
        success: true,
        message: "Quiz session configured successfully.",
        data: QuizDTO.toSessionClient(session),
      });
    } catch (error) {
      next(error);
    }
  }

  async saveAnswer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // 🛠️ Force typecast to string since Zod already verified it is a valid single route parameter string
      const sessionId = req.params.sessionId as string;

      const { questionId, selectedOptions, timeSpentSeconds } = req.body;

      const updatedSession = await quizService.logAnswerAndAdvance(
        sessionId,
        questionId,
        selectedOptions,
        timeSpentSeconds,
      );

      res.status(200).json({
        success: true,
        message: "Progress snapshot stored accurately.",
        data: QuizDTO.toSessionClient(updatedSession),
      });
    } catch (error) {
      next(error);
    }
  }
}
