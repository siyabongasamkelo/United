import mongoose, { Schema, Document } from "mongoose";

// --- MASTER BLUEPRINT SCHEMAS ---
export interface IQuestion {
  _id: mongoose.Types.ObjectId;
  questionText: string;
  options: string[];
  correctAnswers: string[]; // Protected array used by the backend evaluation loop
  points: number;
}

export interface IChapter {
  _id: string; // E.g., "chapter_1"
  title: string;
  questions: IQuestion[];
}

export interface IQuiz extends Document {
  title: string;
  topic: string;
  timeLimitMinutes: number;
  chapters: IChapter[];
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswers: [{ type: String, required: true }],
  points: { type: Number, default: 1 },
});

const ChapterSchema = new Schema<IChapter>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  questions: [QuestionSchema], // Sub-document nesting
});

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true, index: true },
    timeLimitMinutes: { type: Number, required: true },
    chapters: [ChapterSchema],
  },
  { timestamps: true },
);

export const Quiz = mongoose.model<IQuiz>("Feat_Quiz_Master", QuizSchema);

// --- DYNAMIC USER SESSION SCHEMAS ---
export interface IUserResponse {
  questionId: mongoose.Types.ObjectId;
  selectedOptions: string[];
  timeSpentSeconds: number;
  isCorrect?: boolean;
  answeredAt: Date;
}

export interface IQuizSession extends Document {
  userId: string; // Decoupled user tracking
  quizId: mongoose.Types.ObjectId;
  status: "active" | "completed" | "timed_out";
  currentChapterId: string;
  currentQuestionId: mongoose.Types.ObjectId;
  currentIndex: number;
  startedAt: Date;
  expiresAt: Date; // Server enforced absolute time barrier
  responses: IUserResponse[];
  finalScore: number;
  completedAt?: Date;
}

const UserResponseSchema = new Schema<IUserResponse>({
  questionId: { type: Schema.Types.ObjectId, required: true },
  selectedOptions: [{ type: String, required: true }],
  timeSpentSeconds: { type: Number, required: true },
  isCorrect: { type: Boolean },
  answeredAt: { type: Date, default: Date.now },
});

const QuizSessionSchema = new Schema<IQuizSession>(
  {
    userId: { type: String, required: true, index: true },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Feat_Quiz_Master",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "timed_out"],
      default: "active",
    },
    currentChapterId: { type: String, required: true },
    currentQuestionId: { type: Schema.Types.ObjectId, required: true },
    currentIndex: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    responses: [UserResponseSchema], // Nested array log for answer-by-answer tracking
    finalScore: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

// Prevent duplicate active attempts for safety
QuizSessionSchema.index({ userId: 1, quizId: 1, status: 1 });

export const QuizSession = mongoose.model<IQuizSession>(
  "Feat_Quiz_Session",
  QuizSessionSchema,
);
