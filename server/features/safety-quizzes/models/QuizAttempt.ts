import { Schema, model, Document, Types } from "mongoose";

export interface IUserAnswerBreakdown {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface IQuizAttempt extends Document {
  user: Types.ObjectId; // Reference to User who took the quiz
  store: Types.ObjectId; // Store identity context
  branch: Types.ObjectId; // Branch identity context
  quizTopic: Types.ObjectId; // The specific safety module
  attemptDate: Date;
  score: number; // Raw items right
  totalQuestions: number;
  percentageScore: number;
  hasPassed: boolean;
  digitalSignature: string; // Base64 encoded or string handwritten representation
  breakdown: IUserAnswerBreakdown[];
  createdAt: Date;
  updatedAt: Date;
}

const UserAnswerBreakdownSchema = new Schema<IUserAnswerBreakdown>(
  {
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    selectedAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false },
);

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    quizTopic: {
      type: Schema.Types.ObjectId,
      ref: "QuizTopic",
      required: true,
      index: true,
    },
    attemptDate: { type: Date, required: true, default: Date.now },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentageScore: { type: Number, required: true },
    hasPassed: { type: Boolean, required: true, index: true },
    digitalSignature: { type: String, required: true }, // Absolute legal enforcement constraint
    breakdown: { type: [UserAnswerBreakdownSchema], required: true },
  },
  { timestamps: true },
);

export const QuizAttempt = model<IQuizAttempt>(
  "QuizAttempt",
  QuizAttemptSchema,
);
