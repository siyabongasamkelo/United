"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAudit = void 0;
const mongoose_1 = require("mongoose");
// 3. Subdocument Schema
const TrolleyMetricsSchema = new mongoose_1.Schema({
    total: {
        type: Number,
        required: true,
        min: [0, "Total trolleys cannot be negative"],
    },
    damaged: {
        type: Number,
        required: true,
        min: [0, "Damaged count cannot be negative"],
        default: 0,
    },
    dirty: {
        type: Number,
        required: true,
        min: [0, "Dirty count cannot be negative"],
        default: 0,
    },
    operational: {
        type: Number,
        required: true,
        min: [0, "Operational count cannot be negative"],
        default: 0,
    },
}, { _id: false }); // _id is false since it's an embedded metric object, not an independent entity
// 4. Main Schema
const FleetAuditSchema = new mongoose_1.Schema({
    auditDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    store: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
        index: true, // Indexed for fast lookups by store
    },
    branch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true,
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Company", // The trolley collection company
        required: true,
        index: true,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    metrics: {
        type: TrolleyMetricsSchema,
        required: true,
    },
    images: {
        type: [String],
        required: false,
        default: [], // Defaults to an empty array if ignored
    },
    notes: {
        type: String,
        trim: true,
        maxLength: [500, "Notes cannot exceed 500 characters"],
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
});
// Pre-save middleware to automatically calculate operational trolleys if not manually set
// Pre-save middleware using async/await instead of the next callback
FleetAuditSchema.pre("save", async function () {
    if (this.metrics) {
        // Operational = Total - Damaged (Dirty trolleys are still technically operational unless broken)
        this.metrics.operational = this.metrics.total - this.metrics.damaged;
    }
});
exports.FleetAudit = (0, mongoose_1.model)("FleetAudit", FleetAuditSchema);
