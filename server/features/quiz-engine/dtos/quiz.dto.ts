import { IQuiz, IQuizSession } from "../models/quiz.model.js";

export class QuizDTO {
  // Strips correct answers from blueprints so users can't inspect the networking payload
  static toClient(quiz: IQuiz) {
    return {
      id: quiz._id,
      title: quiz.title,
      topic: quiz.topic,
      timeLimitMinutes: quiz.timeLimitMinutes,
      chapters: quiz.chapters.map((chapter) => ({
        id: chapter._id,
        title: chapter.title,
        questions: chapter.questions.map((q) => ({
          id: q._id,
          questionText: q.questionText,
          options: q.options,
          points: q.points,
        })),
      })),
    };
  }

  static toSessionClient(session: IQuizSession) {
    return {
      sessionId: session._id,
      userId: session.userId,
      quizId: session.quizId,
      status: session.status,
      currentChapterId: session.currentChapterId,
      currentQuestionId: session.currentQuestionId,
      currentIndex: session.currentIndex,
      expiresAt: session.expiresAt,
      responsesCount: session.responses.length,
      finalScore: session.finalScore,
      completedAt: session.completedAt,
    };
  }
}
