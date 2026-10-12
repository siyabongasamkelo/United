"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
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
    minTrolleyThreshold: { type: Number },
    managerEmail: { type: String },
}, { timestamps: true }));
