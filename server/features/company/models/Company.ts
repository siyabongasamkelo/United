import { Schema, model, Document } from "mongoose";

export interface ICompany extends Document {
  name: string; // E.g., "United Trolley Services"
  registrationNumber?: string;
  isActive: boolean;
}

export const Company = model<ICompany>(
  "Company",
  new Schema(
    {
      name: { type: String, required: true, unique: true, trim: true },
      registrationNumber: { type: String, trim: true },
      isActive: { type: Boolean, required: true, default: true },
    },
    { timestamps: true },
  ),
);
