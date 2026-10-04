import mongoose, { Schema, Document } from "mongoose";

// ❶ SUB-DOCUMENT INTERFACE: Stores Collection Array Shape
// This embeds the store tracking metadata right inside the user profile for high performance
interface IAssignedStore {
  storeId: string; // Unique ID linking to the Master Stores collection (e.g., 'GAME_01') [2.1]
  storeName: string; // Cached name for fast UI rendering without heavy database joins (e.g., 'Game Home') [2.1]
  assignedAt: Date;
}

// ❷ MAIN USER DOCUMENT INTERFACE
export interface IUser extends Document {
  clerkId: string; // 🔑 Added: The secure anchor mapping directly to Clerk Auth profile
  email: string; // 📧 Primary unique business identifier
  username: string; // Custom profile handle/username
  fullName: string; // Combined first and last name
  contactNumber: string; // Primary phone line for standard cellular calls [1.1]
  whatsappNumber: string; // Dedicated line for automated shift/roster dispatch integrations [1.1]
  address: string; // Physical residential address for HR compliance records
  role: "PORTER" | "SUPERVISOR" | "AREA_MANAGER" | "SYSTEM_ADMIN";
  company: string; // Target organization entity (Defaults to 'United Trolley Services') [1.1]
  branchId: string | null; // Physical hub they work at (e.g., 'GATEWAY_DURBAN'). Null for Area Managers [1.1]
  profilePhoto: string; // CDN URL string pointing to their uploaded profile image
  assignedStores: IAssignedStore[]; // 📦 Sub-document array: The retail targets they collect for [2.1]
  isActive: boolean; // 🚨 Added: Allows instant administrative lockouts without deleting data
  createdAt: Date;
  updatedAt: Date;
}

// ❸ MONGOOSE SUB-DOCUMENT SCHEMA FOR ASSIGNED STORES
const AssignedStoreSchema = new Schema<IAssignedStore>(
  {
    storeId: { type: String, required: true },
    storeName: { type: String, required: true },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false }, // Prevents Mongoose from wasting index memory generating an inner ID for every single array element
);

// ❹ MAIN UNIFIED USER SCHEMA (APPROACH 1)
const UserSchema: Schema = new Schema<IUser>(
  {
    // Clerk ID Hook: Highly indexed for instantaneous sub-2ms logins at scale
    clerkId: { type: String, required: true, unique: true, index: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },

    // Roster Authority Gatekeeper
    role: {
      type: String,
      enum: ["PORTER", "SUPERVISOR", "AREA_MANAGER", "SYSTEM_ADMIN"],
      required: true,
    },

    company: { type: String, default: "United Trolley Services" }, // Pre-filled corporate capture [1.1]

    // Dynamic Hub ID: Sets to 'GATEWAY_DURBAN' for launch. Gracefully drops to null for Area Managers [1.1, 3]
    branchId: { type: String, default: null, index: true },

    profilePhoto: {
      type: String,
      default: "https://clerk.dev", // Uses Clerk's native fallback asset
    },

    // 🔗 Embedded Sub-Document Array: Maximum lookup efficiency for floor operations [1.1, 1.2]
    assignedStores: { type: [AssignedStoreSchema], default: [] },

    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true, // Automatically injects and handles operational createdAt and updatedAt metrics
  },
);

export default mongoose.model<IUser>("User", UserSchema);
