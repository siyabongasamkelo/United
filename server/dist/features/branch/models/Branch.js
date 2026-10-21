"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = void 0;
// 📂 File: united-trolley-backend/features/branch/models/Branch.ts
const mongoose_1 = require("mongoose");
exports.Branch = (0, mongoose_1.model)("Branch", new mongoose_1.Schema({
    area: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true }));
