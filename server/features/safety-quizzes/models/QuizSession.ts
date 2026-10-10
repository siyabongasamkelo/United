import { Schema, model, Document, Types } from "mongoose";

export interface ILiveAnswer {
  questionId: string;
  selectedAnswer: string;
  updatedAt: Date;
}

export interface IQuizSession extends Document {
  user: Types.ObjectId;
  quizTopic: Types.ObjectId;
  store: Types.ObjectId;
  branch: Types.ObjectId;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  answers: ILiveAnswer[];
  startedAt: Date;
  lastActiveAt: Date;
}

const LiveAnswerSchema = new Schema<ILiveAnswer>(
  {
    questionId: { type: String, required: true },
    selectedAnswer: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const QuizSessionSchema = new Schema<IQuizSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quizTopic: {
      type: Schema.Types.ObjectId,
      ref: "QuizTopic",
      required: true,
    },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "ABANDONED"],
      default: "IN_PROGRESS",
      index: true,
    },
    answers: { type: [LiveAnswerSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Ensure a user can only have one active session per quiz topic at a time
QuizSessionSchema.index(
  { user: 1, quizTopic: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "IN_PROGRESS" } },
);

export const QuizSession = model<IQuizSession>(
  "QuizSession",
  QuizSessionSchema,
);
