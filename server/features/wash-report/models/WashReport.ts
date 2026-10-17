import { Schema, model, Document, Types } from "mongoose";

export interface IWashReport extends Document {
  trolleyId: string; // E.g., "UTS-042"
  storeOrigin: Types.ObjectId; // Links back to target store context (Game, Dis-Chem, etc.)
  branchId: Types.ObjectId; // 🚀 Secure branch tracking context
  contaminationType:
    | "SPILLAGE"
    | "MUD_DIRT"
    | "STICKER_RESIDUE"
    | "TRASH_ACCUMULATION"
    | "OTHER";
  washPriority: "LOW" | "MEDIUM" | "HIGH";
  washStatus: "PENDING_WASH" | "IN_WASH_BAY" | "CLEANED";
  reportedBy: Types.ObjectId; // Links back to User collection for employee context
  notes?: string; // Optional floor observations
  evidenceImageUrl?: string; // Optional image reference for wash verification
  createdAt: Date;
  updatedAt: Date;
}

const WashReportSchema = new Schema<IWashReport>(
  {
    trolleyId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    storeOrigin: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    contaminationType: {
      type: String,
      enum: [
        "SPILLAGE",
        "MUD_DIRT",
        "STICKER_RESIDUE",
        "TRASH_ACCUMULATION",
        "OTHER",
      ],
      required: true,
    },
    washPriority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
      index: true,
    },
    washStatus: {
      type: String,
      enum: ["PENDING_WASH", "IN_WASH_BAY", "CLEANED"],
      required: true,
      default: "PENDING_WASH",
      index: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    evidenceImageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const WashReport = model<IWashReport>("WashReport", WashReportSchema);
