// 📂 File: united-trolley-backend/features/store/models/Store.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IStore extends Document {
  branch: Types.ObjectId; // 🔗 Linked to Branch -> Area -> Company
  name: string; // E.g., "GAME GATEWAY"
  storeCode: string; // E.g., "GM-GAT-01"
  isActive: boolean;

  // 📞 Contact Info
  manager: {
    name: string;
    email: string;
    phone: string;
  };

  // 🛒 Fleet Analytics Bounds
  trolleyConfig: {
    minThreshold: number; // Warning flag if total counts drop below this
    maxCapacity: number; // Safety ceiling to trap typo validation errors
    auditFrequency: "DAILY" | "TWICE_DAILY" | "WEEKLY";
  };

  // 📍 Location Infrastructure
  location: {
    address: string;
    city: string;
    province: string; // E.g., "KwaZulu-Natal", "Gauteng"
  };

  // 🛰️ Geofencing Vector Coordinates
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const Store = model<IStore>(
  "Store",
  new Schema(
    {
      branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true,
      },
      name: { type: String, required: true, trim: true },
      storeCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },
      isActive: { type: Boolean, required: true, default: true },

      manager: {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
      },

      trolleyConfig: {
        minThreshold: { type: Number, required: true, default: 20 },
        maxCapacity: { type: Number, required: true, default: 300 },
        auditFrequency: {
          type: String,
          enum: ["DAILY", "TWICE_DAILY", "WEEKLY"],
          default: "TWICE_DAILY",
        },
      },

      location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
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
