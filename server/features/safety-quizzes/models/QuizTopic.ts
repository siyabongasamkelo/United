import { Schema, model, Document } from "mongoose";

export interface IQuizQuestion {
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswer: string; // E.g., "B"
  explanation: string; // Shown at the end to educate the worker
}

export interface IQuizTopic extends Document {
  title: string;
  description: string;
  hazardLevel: "LOW" | "MEDIUM" | "HIGH";
  passingScorePercentage: number; // Defaults to 80% or 100% based on legal criteria
  questions: IQuizQuestion[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    questionId: { type: String, required: true },
    questionText: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    correctAnswer: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    explanation: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const QuizTopicSchema = new Schema<IQuizTopic>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    hazardLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
      default: "LOW",
    },
    passingScorePercentage: {
      type: Number,
      required: true,
      default: 80,
      min: 0,
      max: 100,
    },
    questions: { type: [QuizQuestionSchema], required: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export const QuizTopic = model<IQuizTopic>("QuizTopic", QuizTopicSchema);
