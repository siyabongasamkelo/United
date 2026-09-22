import { Schema, model, Document, Types } from "mongoose";

export interface IJobListing extends Document {
  companyId: Types.ObjectId;
  title: string;
  description: string;
  location: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CASUAL" | "CONTRACT";
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    rate: "HOURLY" | "ANNUAL";
  };
  requiredCertifications: Types.ObjectId[];
  minPassingScoreRequired: number;
  status: "DRAFT" | "ACTIVE" | "CLOSED";
}

const JobListingSchema = new Schema<IJobListing>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CASUAL", "CONTRACT"],
      required: true,
    },
    salaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: "USD" },
      rate: { type: String, enum: ["HOURLY", "ANNUAL"], required: true },
    },
    requiredCertifications: [{ type: Schema.Types.ObjectId, ref: "Test" }],
    minPassingScoreRequired: { type: Number, default: 80 },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

export const JobListingModel = model<IJobListing>(
  "JobListing",
  JobListingSchema,
);
