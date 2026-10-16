// 📂 File: united-trolley-backend/features/area/models/Area.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IArea extends Document {
  company: Types.ObjectId; // 🔗 Parent Link: Area -> Company
  name: string; // E.g., "Gauteng South", "KZN Coastal"
  areaCode: string; // E.g., "REG-KZN-01"
  isActive: boolean;

  // 👤 Regional Leadership Contact Block
  leadership: {
    regionalManager: {
      name: string;
      email: string;
      phone: string;
    };
  };

  // 🎯 Operational Targets & Guardrails
  regionalKPIs: {
    targetLossRateCeiling: number; // Percentage ceiling, e.g., 5.0 for 5%
    allowedBudgetType: string; // Administrative grouping for repair funds
  };

  // ⚙️ Localization Data
  localization: {
    province: string; // Primary province anchor
    currency: "ZAR" | "USD" | "EUR";
  };
}

export const Area = model<IArea>(
  "Area",
  new Schema(
    {
      company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
      },
      name: { type: String, required: true, unique: true, trim: true },
      areaCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },
      isActive: { type: Boolean, required: true, default: true },

      leadership: {
        regionalManager: {
          name: { type: String, required: true, trim: true },
          email: { type: String, required: true, lowercase: true, trim: true },
          phone: { type: String, required: true, trim: true },
        },
      },

      regionalKPIs: {
        targetLossRateCeiling: { type: Number, required: true, default: 5.0 },
        allowedBudgetType: { type: String, default: "STANDARD_REPAIR" },
      },

      localization: {
        province: { type: String, required: true },
        currency: { type: String, enum: ["ZAR", "USD", "EUR"], default: "ZAR" },
      },
    },
    { timestamps: true },
  ),
);
