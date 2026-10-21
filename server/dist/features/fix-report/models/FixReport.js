"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixReport = void 0;
const mongoose_1 = require("mongoose");
const FixReportSchema = new mongoose_1.Schema({
    trolleyId: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        index: true,
    },
    storeOrigin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
        index: true,
    },
    branchId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch", // Assuming your target branch model collection string identifier is 'Branch'
        required: true,
        index: true,
    },
    brokenComponent: {
        type: String,
        enum: [
            "CASTOR_WHEELS",
            "BACK_GATE",
            "CHASSIS_FRAME",
            "ROPE_STEER_MOUNT",
            "OTHER",
        ],
        required: true,
    },
    damageSeverity: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        required: true,
        index: true,
    },
    maintenanceStatus: {
        type: String,
        enum: ["PENDING_REPAIR", "UNDER_MAINTENANCE", "RESOLVED"],
        required: true,
        default: "PENDING_REPAIR",
        index: true,
    },
    reportedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500, // Safe ceiling for mobile inputs
    },
    evidenceImageUrl: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
exports.FixReport = (0, mongoose_1.model)("FixReport", FixReportSchema);
