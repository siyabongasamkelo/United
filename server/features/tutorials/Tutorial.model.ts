import { Schema, model, Document, Types } from "mongoose";

export interface ITutorialStep {
  timestamp: number;
  instructionTitle: string;
  instructionBody: string;
}

export interface ITutorial extends Document {
  title: string;
  category: "ROPE_TYING" | "PASSAGE_NAVIGATION" | "EQUIPMENT_SAFETY";
  videoUrl: string;
  durationInSeconds: number;
  steps: ITutorialStep[];
  associatedTestId?: Types.ObjectId;
  isActive: boolean;
}

const TutorialStepSchema = new Schema<ITutorialStep>({
  timestamp: { type: Number, required: true }, // in seconds
  instructionTitle: { type: String, required: true },
  instructionBody: { type: String, required: true },
});

const TutorialSchema = new Schema<ITutorial>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["ROPE_TYING", "PASSAGE_NAVIGATION", "EQUIPMENT_SAFETY"],
      required: true,
    },
    videoUrl: { type: String, required: true },
    durationInSeconds: { type: Number, required: true },
    steps: [TutorialStepSchema],
    associatedTestId: { type: Schema.Types.ObjectId, ref: "Test" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const TutorialModel = model<ITutorial>("Tutorial", TutorialSchema);
