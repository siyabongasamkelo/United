"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = void 0;
const mongoose_1 = require("mongoose");
exports.Branch = (0, mongoose_1.model)("Branch", new mongoose_1.Schema({
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },
    name: { type: String, required: true, trim: true },
    locationCity: { type: String, required: true, trim: true },
    isActive: { type: Boolean, required: true, default: true },
}, { timestamps: true }));
