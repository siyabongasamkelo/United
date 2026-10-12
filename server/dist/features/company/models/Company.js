"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const mongoose_1 = require("mongoose");
exports.Company = (0, mongoose_1.model)("Company", new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    registrationNumber: { type: String, trim: true },
    isActive: { type: Boolean, required: true, default: true },
}, { timestamps: true }));
