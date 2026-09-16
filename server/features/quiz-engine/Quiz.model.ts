import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion {
  _id: Types.ObjectId;
  type: "MULTIPLE_CHOICE" | "SPATIAL_HOTSPOT" | "SEQUENCE";
  prompt: string;
  mediaUrl?: string;
  options?: string[];
  correctAnswer: any;
  points: number;
  explanation: string;
}

export interface IQuizSection {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  passingScorePercentage: number;
  questions: IQuestion[];
}

export interface ITest extends Document {
  title: string;
  description: string;
  companyId: Types.ObjectId;
  sections: IQuizSection[];
  isActive: boolean;
}

const QuestionSchema = new Schema<IQuestion>({
  type: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "SPATIAL_HOTSPOT", "SEQUENCE"],
    required: true,
  },
  prompt: { type: String, required: true },
  mediaUrl: { type: String },
  options: [{ type: String }],
  correctAnswer: { type: Schema.Types.Mixed, required: true },
  points: { type: Number, default: 10 },
  explanation: { type: String, required: true },
});

const QuizSectionSchema = new Schema<IQuizSection>({
  title: { type: String, required: true },
  description: { type: String },
  passingScorePercentage: { type: Number, default: 80 },
  questions: [QuestionSchema],
});

const TestSchema = new Schema<ITest>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, required: true },
    sections: [QuizSectionSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const TestModel = model<ITest>("Test", TestSchema);
