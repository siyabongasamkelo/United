"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// ❸ MONGOOSE SUB-DOCUMENT SCHEMA FOR ASSIGNED STORES
const AssignedStoreSchema = new mongoose_1.Schema({
    storeId: { type: String, required: true },
    storeName: { type: String, required: true },
    assignedAt: { type: Date, default: Date.now },
}, { _id: false });
// ❹ MAIN UNIFIED USER SCHEMA (APPROACH 1)
const UserSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true, // Automatically injects and handles operational createdAt and updatedAt metrics
});
exports.default = mongoose_1.default.model("User", UserSchema);
