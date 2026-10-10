import { Schema, model, Document, Types } from "mongoose";

export interface IStore extends Document {
  branch: Types.ObjectId;
  name: string;
  storeCode: string;
  isActive: boolean;
  // 🆕 NEW OPERATIONAL FIELDS FOR BACKGROUND ALERTS
  minTrolleyThreshold: number; // E.g., 150
  managerEmail: string; // E.g., "manager.gamestore@retail.co.za"
}

export const Store = model<IStore>(
  "Store",
  new Schema(
    {
      branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true,
      },
      name: { type: String, required: true, trim: true },
      storeCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },
      isActive: { type: Boolean, required: true, default: true },
      minTrolleyThreshold: { type: Number },
      managerEmail: { type: String },
    },
    { timestamps: true },
  ),
);
