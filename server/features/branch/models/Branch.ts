import { Schema, model, Document, Types } from "mongoose";

export interface IBranch extends Document {
  company: Types.ObjectId; // Ties back to Master Tenant
  name: string; // E.g., "Gateway Theatre of Shopping"
  locationCity: string; // E.g., "Umhlanga / Durban"
  isActive: boolean;
}

export const Branch = model<IBranch>(
  "Branch",
  new Schema(
    {
      company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
      },
      name: { type: String, required: true, trim: true },
      locationCity: { type: String, required: true, trim: true },
      isActive: { type: Boolean, required: true, default: true },
    },
    { timestamps: true },
  ),
);
