import { Schema, model, Document, Types } from "mongoose";

// 1. Subdocument Interface for Trolley Conditions
export interface ITrolleyMetrics {
  total: number;
  damaged: number;
  dirty: number;
  operational: number; // Added to easily track ready-to-use trolleys without calculating on the fly
}

// 2. Main Fleet Audit Interface
export interface IFleetAudit extends Document {
  auditDate: Date;
  store: Types.ObjectId; // Reference to the Store model
  branch: Types.ObjectId; // Reference to the Branch model
  company: Types.ObjectId; // Reference to the Trolley Collection/Service Company
  author: Types.ObjectId; // Reference to the User who performed the audit
  metrics: ITrolleyMetrics; // Grouped subdocument for trolley counts
  images?: string[]; // Optional array of image URLs/S3 keys
  notes?: string; // Added for inspectors to leave comments about the audit
  createdAt: Date;
  updatedAt: Date;
}

// 3. Subdocument Schema
const TrolleyMetricsSchema = new Schema<ITrolleyMetrics>(
  {
    total: {
      type: Number,
      required: true,
      min: [0, "Total trolleys cannot be negative"],
    },
    damaged: {
      type: Number,
      required: true,
      min: [0, "Damaged count cannot be negative"],
      default: 0,
    },
    dirty: {
      type: Number,
      required: true,
      min: [0, "Dirty count cannot be negative"],
      default: 0,
    },
    operational: {
      type: Number,
      required: true,
      min: [0, "Operational count cannot be negative"],
      default: 0,
    },
  },
  { _id: false },
); // _id is false since it's an embedded metric object, not an independent entity

// 4. Main Schema
const FleetAuditSchema = new Schema<IFleetAudit>(
  {
    auditDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true, // Indexed for fast lookups by store
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company", // The trolley collection company
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metrics: {
      type: TrolleyMetricsSchema,
      required: true,
    },
    images: {
      type: [String],
      required: false,
      default: [], // Defaults to an empty array if ignored
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

// Pre-save middleware to automatically calculate operational trolleys if not manually set
// Pre-save middleware using async/await instead of the next callback
FleetAuditSchema.pre("save", async function (this: IFleetAudit) {
  if (this.metrics) {
    // Operational = Total - Damaged (Dirty trolleys are still technically operational unless broken)
    this.metrics.operational = this.metrics.total - this.metrics.damaged;
  }
});

export const FleetAudit = model<IFleetAudit>("FleetAudit", FleetAuditSchema);
