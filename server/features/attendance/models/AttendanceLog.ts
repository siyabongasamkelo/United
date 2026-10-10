import { Schema, model, Document, Types } from "mongoose";

export interface IPpeDeclaration {
  hasSafetyBoots: boolean;
  hasReflectorVest: boolean;
  hasSteeringRope: boolean;
}

export interface IAttendanceLog extends Document {
  user: Types.ObjectId; // Porter/Supervisor context reference
  branch: Types.ObjectId; // Physical operational terminal boundary (Gateway)
  shiftWave: "MORNING" | "REINFORCEMENT" | "NIGHT_SWEEPERS";
  clockInTime: Date; // Strict server-enforced timestamp
  latitude: number; // Captured floor coordinates
  longitude: number; // Captured floor coordinates
  isGeofenceVerified: boolean;
  ppeDeclaration: IPpeDeclaration; // Direct OHS Act 85 of 1993 liability shield
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
    clockInTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    isGeofenceVerified: { type: Boolean, required: true, default: false },
    ppeDeclaration: { type: PpeDeclarationSchema, required: true },
  },
  { timestamps: true },
);

// Compounding unique index layout: Prevents an operator from logging the same shift wave twice on the same day
AttendanceLogSchema.index({ user: 1, branch: 1, shiftWave: 1, createdAt: 1 });

export const AttendanceLog = model<IAttendanceLog>(
  "AttendanceLog",
  AttendanceLogSchema,
);
