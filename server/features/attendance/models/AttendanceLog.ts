// 📂 File: features/attendance/models/AttendanceLog.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IPpeDeclaration {
  hasSafetyBoots: boolean;
  hasReflectorVest: boolean;
  hasSteeringRope: boolean;
}

export interface IAttendanceLog extends Document {
  user: Types.ObjectId;
  branch: Types.ObjectId;
  shiftWave: "MORNING" | "REINFORCEMENT" | "NIGHT_SWEEPERS";
  status: "ACTIVE" | "CLOCKED_OUT" | "BREAK"; // 🆕 Tracks exact shift stage

  // 📥 Clock-In Data
  clockInTime: Date;
  latitude: number;
  longitude: number;
  isGeofenceVerified: boolean;
  ppeDeclaration: IPpeDeclaration;
  ppeSelfieUrl?: string; // 🆕 Optional safety selfie validation link

  // 📤 Clock-Out Data (🆕 Added to complete the shift lifecycle)
  clockOutTime?: Date;
  clockOutLatitude?: number;
  clockOutLongitude?: number;

  // 📱 Device Diagnostics & Comms
  telemetry?: {
    batteryLevel: number;
    platform: string;
  };
  shiftNotes?: string; // 🆕 For late reasons or breakdown details
  createdAt: Date;
  updatedAt: Date;
}

const PpeDeclarationSchema = new Schema<IPpeDeclaration>(
  {
    hasSafetyBoots: { type: Boolean, required: true },
    hasReflectorVest: { type: Boolean, required: true },
    hasSteeringRope: { type: Boolean, required: true },
  },
  { _id: false },
);

const AttendanceLogSchema = new Schema<IAttendanceLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    shiftWave: {
      type: String,
      enum: ["MORNING", "REINFORCEMENT", "NIGHT_SWEEPERS"],
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CLOCKED_OUT", "BREAK"],
      default: "ACTIVE",
      required: true,
      index: true,
    },

    // Clock-In Vector Core
    clockInTime: { type: Date, required: true, default: Date.now },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    isGeofenceVerified: { type: Boolean, required: true, default: false },
    ppeDeclaration: { type: PpeDeclarationSchema, required: true },
    ppeSelfieUrl: { type: String },

    // Clock-Out Vector Core (Defaults to undefined until shift finalization)
    clockOutTime: { type: Date },
    clockOutLatitude: { type: Number },
    clockOutLongitude: { type: Number },

    // Device Metadata & Troubleshooting Properties
    telemetry: {
      batteryLevel: { type: Number },
      platform: { type: String },
    },
    shiftNotes: { type: String, trim: true, maxLength: 300 },
  },
  { timestamps: true },
);

AttendanceLogSchema.index({ user: 1, branch: 1, shiftWave: 1, createdAt: 1 });

export const AttendanceLog = model<IAttendanceLog>(
  "AttendanceLog",
  AttendanceLogSchema,
);
