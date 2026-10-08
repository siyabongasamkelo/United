import { Schema, model, Document, Types } from "mongoose";

export interface IFixReport extends Document {
  trolleyId: string; // E.g., "UTS-042" from terminal input profile
  storeOrigin: Types.ObjectId; // Links back to target store context (Game, Dis-Chem, etc.)
  brokenComponent:
    | "CASTOR_WHEELS"
    | "BACK_GATE"
    | "CHASSIS_FRAME"
    | "ROPE_STEER_MOUNT"
    | "OTHER";
  damageSeverity: "LOW" | "MEDIUM" | "HIGH";
  maintenanceStatus: "PENDING_REPAIR" | "UNDER_MAINTENANCE" | "RESOLVED";
  reportedBy: Types.ObjectId; // Links back to User collection to determine exact employee context
  notes?: string; // Optional text context for explicit floor details
  evidenceImageUrl?: string; // Optional verified storage reference link for Area Managers
  createdAt: Date;
  updatedAt: Date;
}

const FixReportSchema = new Schema<IFixReport>(
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
    brokenComponent: {
      type: String,
      enum: [
        "CASTOR_WHEELS",
        "BACK_GATE",
        "CHASSIS_FRAME",
        "ROPE_STEER_MOUNT",
        "OTHER",
      ],
      required: true,
    },
    damageSeverity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
      index: true,
    },
    maintenanceStatus: {
      type: String,
      enum: ["PENDING_REPAIR", "UNDER_MAINTENANCE", "RESOLVED"],
      required: true,
      default: "PENDING_REPAIR",
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
      maxlength: 500, // Safe ceiling for mobile inputs
    },
    evidenceImageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const FixReport = model<IFixReport>("FixReport", FixReportSchema);
