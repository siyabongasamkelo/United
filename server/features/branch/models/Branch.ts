// 📂 File: united-trolley-backend/features/branch/models/Branch.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IBranch extends Document {
  area: Types.ObjectId; // 🔗 Parent Link: Branch -> Area -> Company
  name: string; // E.g., "GATEWAY HUB"
  branchCode: string; // E.g., "BR-GAT-03"
  isActive: boolean;

  // 👷 Operational Properties
  config: {
    branchType: "OPERATIONAL" | "HEADQUARTERS" | "STORAGE";
    hasRepairFacility: boolean; // Flags if this hub can fix broken units on-site
  };

  // 📞 Branch Leadership Contacts
  contacts: {
    branchManager: {
      name: string;
      email: string;
      phone: string;
    };
    opsCoordinator?: {
      name: string;
      email: string;
      phone: string;
    };
  };

  // 📍 Logistics Footprint
  logistics: {
    depotAddress: string;
    city: string;
  };

  // 🛰️ Geofencing Vector Coordinates
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const Branch = model<IBranch>(
  "Branch",
  new Schema(
    {
      area: {
        type: Schema.Types.ObjectId,
        ref: "Area",
        required: true,
        index: true,
      },
      name: { type: String, required: true, trim: true },
      branchCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },
      isActive: { type: Boolean, required: true, default: true },

      config: {
        branchType: {
          type: String,
          enum: ["OPERATIONAL", "HEADQUARTERS", "STORAGE"],
          default: "OPERATIONAL",
        },
        hasRepairFacility: { type: Boolean, required: true, default: false },
      },

      contacts: {
        branchManager: {
          name: { type: String, required: true, trim: true },
          email: { type: String, required: true, lowercase: true, trim: true },
          phone: { type: String, required: true, trim: true },
        },
        opsCoordinator: {
          name: { type: String, trim: true },
          email: { type: String, lowercase: true, trim: true },
          phone: { type: String, trim: true },
        },
      },

      logistics: {
        depotAddress: { type: String, required: true },
        city: { type: String, required: true },
      },

      // 🚨 NEW COMPLIANCE GEOFENCE COORDINATE KEYS
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    { timestamps: true },
  ),
);
