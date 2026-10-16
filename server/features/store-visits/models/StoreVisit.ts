import { Schema, model, Document, Types } from "mongoose";

// ❶ Verification Status Enum Definition
export type TVerificationStatus =
  | "VERIFIED"
  | "LOCATION_MISMATCH"
  | "FAILED_TELEMETRY";

// ❷ Coordinate Structure Subdocument Interface
export interface IGeoPoint {
  latitude: number;
  longitude: number;
}

// ❸ Main Store Visit Document Interface
export interface IStoreVisit extends Document {
  porter: Types.ObjectId; // Reference to User profile (req.user)
  store: Types.ObjectId; // Reference to scanned Store profile
  branch: Types.ObjectId; // Reference to Branch (e.g., Gateway)
  scannedAt: Date; // Exact operational timestamp
  deviceCoordinates: IGeoPoint; // Raw hardware capture from phone browser
  storeCoordinatesSnapshot: IGeoPoint; // Frozen checkpoint of store's location parameters
  distanceDelta: number; // Calculated delta distance in meters
  verificationStatus: TVerificationStatus; // Final validation categorization
  notes?: string; // For supervisors to override flags if necessary
  createdAt: Date;
  updatedAt: Date;
}

// Coordinate Sub-schema Layout
const GeoPointSchema = new Schema<IGeoPoint>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false },
);

// ❹ Main Schema Definition
const StoreVisitSchema = new Schema<IStoreVisit>(
  {
    porter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimized for generating individualized porter performance logs
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true, // Optimized for pulling storefront coverage proof for anchor tenants
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true, // Segment charts easily by shopping mall territory limits
    },
    scannedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true, // Critically indexed to perform super-fast daily/weekly date-window lookups
    },
    deviceCoordinates: {
      type: GeoPointSchema,
      required: true,
    },
    storeCoordinatesSnapshot: {
      type: GeoPointSchema,
      required: true,
    },
    distanceDelta: {
      type: Number,
      required: true,
      min: 0,
    },
    verificationStatus: {
      type: String,
      enum: ["VERIFIED", "LOCATION_MISMATCH", "FAILED_TELEMETRY"],
      required: true,
      default: "LOCATION_MISMATCH",
      index: true, // Allows managers to instantly filter down fraudulent attempts
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 300,
    },
  },
  {
    timestamps: true, // Automatically manages backend tracking logs (createdAt, updatedAt)
  },
);

// ❺ Compound Indexes for Analytical Power
// Speeds up calculations when generating a timeline of a single porter's day
StoreVisitSchema.index({ porter: 1, scannedAt: -1 });

export const StoreVisit = model<IStoreVisit>("StoreVisit", StoreVisitSchema);
