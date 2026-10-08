import { QuizTopic, IQuizTopic } from "../models/QuizTopic";
import { QuizAttempt, IQuizAttempt } from "../models/QuizAttempt";
import { Types } from "mongoose";

export class QuizRepository {
  async findActiveTopics(): Promise<IQuizTopic[]> {
    // Select everything except the correct answers for raw delivery list visualization
    return await QuizTopic.find({ isActive: true }).select(
      "-questions.correctAnswer",
    );
  }

  async findTopicById(id: string): Promise<IQuizTopic | null> {
    return await QuizTopic.findById(id);
  }

  async createAttempt(
    attemptData: Partial<IQuizAttempt>,
  ): Promise<IQuizAttempt> {
    const attempt = new QuizAttempt(attemptData);
    return await attempt.save();
  }

  async findAttemptsByUser(userId: string): Promise<IQuizAttempt[]> {
    return await QuizAttempt.find({ user: new Types.ObjectId(userId) })
      .populate("quizTopic", "title hazardLevel")
      .sort({ attemptDate: -1 });
  }

  // Administrative metric tool aggregation query for your supervisor dashboard screens
  async getComplianceStatsByBranch(branchId: string) {
    return await QuizAttempt.aggregate([
      { $match: { branch: new Types.ObjectId(branchId) } },
      {
        $group: {
          _id: "$hasPassed",
          count: { $sum: 1 },
          avgScore: { $avg: "$percentageScore" },
        },
      },
    ]);
  }
}
