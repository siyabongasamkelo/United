import { TestModel, ITest } from "./Quiz.model";
import { Types } from "mongoose";

export class QuizRepository {
  // Public delivery: strips out correct answers
  async getTestBlueprint(testId: string): Promise<ITest | null> {
    return await TestModel.findById(testId)
      .select("-sections.questions.correctAnswer")
      .lean();
  }

  // Secure delivery: retains answers for server-side evaluation
  async getTestWithAnswers(testId: string): Promise<ITest | null> {
    return await TestModel.findById(testId).lean();
  }

  async saveAttempt(attemptData: any): Promise<any> {
    // Imagine an AttemptModel saving the processed grade layout here
    return attemptData;
  }
}
