import { Schema, model, Types, Document } from "mongoose";

// Application Schema Definition
interface IJobApplication extends Document {
  jobListingId: Types.ObjectId;
  applicantId: Types.ObjectId;
  status:
    | "APPLIED"
    | "REVIEWING"
    | "INTERVIEW_SCHEDULED"
    | "HIRED"
    | "REJECTED";
  verifiedScoresSnapshot: Array<{
    testId: Types.ObjectId;
    scorePercentage: number;
  }>;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobListingId: {
      type: Schema.Types.ObjectId,
      ref: "JobListing",
      required: true,
    },
    applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "APPLIED",
        "REVIEWING",
        "INTERVIEW_SCHEDULED",
        "HIRED",
        "REJECTED",
      ],
      default: "APPLIED",
    },
    verifiedScoresSnapshot: [
      {
        testId: { type: Schema.Types.ObjectId, ref: "Test" },
        scorePercentage: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const JobApplicationModel = model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema,
);

export class JobApplicationRepository {
  // Atomic generation of job application entry
  async apply(payload: Partial<IJobApplication>): Promise<IJobApplication> {
    return await JobApplicationModel.create(payload);
  }

  // Pulls applications for a job listing so company management can review candidates
  async getApplicantsForJob(jobId: string): Promise<IJobApplication[]> {
    return await JobApplicationModel.find({ jobListingId: jobId })
      .populate("applicantId", "firstName lastName email profilePicture")
      .sort({ "verifiedScoresSnapshot.scorePercentage": -1 }) // 👈 Automatically sorts by best performers!
      .lean();
  }
}
