"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 10 requests per windowMs
    message: {
        message: "Too many attempts from this IP, please try again after 15 minutes",
    },
    standardHeaders: "draft-7", // combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
exports.generalLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 100, // Limit each IP to 100 requests per hour
    message: {
        message: "You have reached your hourly request limit.",
    },
});
