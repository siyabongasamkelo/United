"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
// 📂 File: united-trolley-backend/features/store/models/Store.ts
const mongoose_1 = require("mongoose");
exports.Store = (0, mongoose_1.model)("Store", new mongoose_1.Schema({
    branch: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true }));
