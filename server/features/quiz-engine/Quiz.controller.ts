import { Request, Response, NextFunction } from "express";
import { QuizService } from "./Quiz.service";

export class QuizController {
  private quizService = new QuizService();

  getQuizBlueprint = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.quizService.fetchBlueprint(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  submitQuiz = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { testId, answers } = req.body;
      const evaluation = await this.quizService.evaluateTest(testId, answers);
      res.status(200).json({ success: true, data: evaluation });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
