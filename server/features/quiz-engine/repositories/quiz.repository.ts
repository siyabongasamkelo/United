import {
  Quiz,
  QuizSession,
  IQuiz,
  IQuizSession,
  IUserResponse,
} from "../models/quiz.model.js";
import mongoose from "mongoose";

export class QuizRepository {
  async findQuizById(quizId: string): Promise<IQuiz | null> {
    return Quiz.findById(quizId);
  }

  async findSessionById(sessionId: string): Promise<IQuizSession | null> {
    return QuizSession.findById(sessionId);
  }

  async createSession(data: Partial<IQuizSession>): Promise<IQuizSession> {
    return QuizSession.create(data);
  }

  async saveSession(session: IQuizSession): Promise<IQuizSession> {
    return session.save();
  }

  async findActiveUserSession(
    userId: string,
    quizId: string,
  ): Promise<IQuizSession | null> {
    return QuizSession.findOne({ userId, quizId, status: "active" });
  }
}
