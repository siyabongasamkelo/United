"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceLog = void 0;
// 📂 File: features/attendance/models/AttendanceLog.ts
const mongoose_1 = require("mongoose");
const PpeDeclarationSchema = new mongoose_1.Schema({
    hasSafetyBoots: { type: Boolean, required: true },
    hasReflectorVest: { type: Boolean, required: true },
    hasSteeringRope: { type: Boolean, required: true },
}, { _id: false });
const AttendanceLogSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    branch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true,
    },
    shiftWave: {
        type: String,
        enum: ["MORNING", "REINFORCEMENT", "NIGHT_SWEEPERS"],
        required: true,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "CLOCKED_OUT", "BREAK"],
        default: "ACTIVE",
        required: true,
        index: true,
    },
    // Clock-In Vector Core
    clockInTime: { type: Date, required: true, default: Date.now },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    isGeofenceVerified: { type: Boolean, required: true, default: false },
    ppeDeclaration: { type: PpeDeclarationSchema, required: true },
    ppeSelfieUrl: { type: String },
    // Clock-Out Vector Core (Defaults to undefined until shift finalization)
    clockOutTime: { type: Date },
    clockOutLatitude: { type: Number },
    clockOutLongitude: { type: Number },
    // Device Metadata & Troubleshooting Properties
    telemetry: {
        batteryLevel: { type: Number },
        platform: { type: String },
    },
    shiftNotes: { type: String, trim: true, maxLength: 300 },
}, { timestamps: true });
AttendanceLogSchema.index({ user: 1, branch: 1, shiftWave: 1, createdAt: 1 });
exports.AttendanceLog = (0, mongoose_1.model)("AttendanceLog", AttendanceLogSchema);
