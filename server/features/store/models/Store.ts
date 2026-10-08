import { Schema, model, Document, Types } from "mongoose";

export interface IStore extends Document {
  branch: Types.ObjectId; // Ties back to the physical mall boundary
  name: string; // E.g., "★ GAME STORE"
  storeCode: string; // E.g., "GM-GATE-01" for absolute auditing
  isActive: boolean;
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
    },
    { timestamps: true },
  ),
);
