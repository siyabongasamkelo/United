import { Schema, model, Document, Types } from "mongoose";

export interface ICertification extends Document {
  user: Types.ObjectId; // Ties straight back to your Porter profile record
  quizAttempt: Types.ObjectId; // Links directly to the passing QuizAttempt ID
  quizTopic: Types.ObjectId; // The specific safety module passed
  dateEarned: Date;
  verificationHash: string; // Unique tamper-proof validation signature string
}

const CertificationSchema = new Schema<ICertification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quizAttempt: {
      type: Schema.Types.ObjectId,
      ref: "QuizAttempt",
      required: true,
    },
    quizTopic: {
      type: Schema.Types.ObjectId,
      ref: "QuizTopic",
      required: true,
      index: true,
    },
    dateEarned: { type: Date, required: true, default: Date.now },
    verificationHash: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Certification = model<ICertification>(
  "Certification",
  CertificationSchema,
);
