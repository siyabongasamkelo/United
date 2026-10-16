import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../shared/middleware/authMiddleware";
import { QuizService } from "../services/QuizService";
import { Types } from "mongoose";
import { Certification } from "../../certificate/models/Certification";

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
  }

  getAvailableQuizzes = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.quizService.getActiveQuestionnaires();
      res
        .status(200)
        .json({ success: true, count: result.length, data: result });
    } catch (error) {
      next(error);
    }
  };

  submitAnswers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Pull user contextual indices securely out of your hydration middleware pipeline profile
      const localUserId = req.user?._id;
      const result = await this.quizService.processQuizSubmission(
        req.body,
        String(localUserId),
      );

      res.status(201).json({
        success: true,
        message: result.hasPassed
          ? "Training module passed and digital safety signature logged successfully."
          : "Quiz complete. Minimum passing legal threshold not met.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getHistoryLogs = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const localUserId = req.user?._id;
      const result = await this.quizService.fetchPersonalLogs(
        String(localUserId),
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getBranchMetrics = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const branchId = req.query.branchId as string;
      const result = await this.quizService.fetchBranchStats(branchId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  // Add these methods inside your QuizController class in File 1

  startQuizSession = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const localUserId = req.user?._id;
      const { quizTopicId, storeId, branchId } = req.body;

      const session = await this.quizService.initializeOrResumeSession(
        String(localUserId),
        quizTopicId,
        storeId,
        branchId,
      );

      res.status(200).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  };

  saveLiveAnswer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const localUserId = req.user?._id;
      const { quizTopicId, questionId, selectedAnswer } = req.body;

      const session = await this.quizService.updateLiveAnswer(
        String(localUserId),
        quizTopicId,
        questionId,
        selectedAnswer,
      );

      res.status(200).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  };

  // Append this method inside your QuizController class in File 1

  getCertificateByAttempt = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { attemptId } = req.params;
      const localUserId = req.user?._id;

      // Direct look-up matching your certificate hook structural fields
      const certificate = await Certification.findOne({
        user: new Types.ObjectId(String(localUserId)),
        //  Fixed Clean Line
        quizAttempt: new Types.ObjectId(String(attemptId)),
      }).populate("quizTopic", "title description hazardLevel");

      if (!certificate) {
        res
          .status(404)
          .json({ success: false, message: "Certificate records not found." });
        return;
      }

      res.status(200).json({ success: true, data: certificate });
    } catch (error) {
      next(error);
    }
  };
}
