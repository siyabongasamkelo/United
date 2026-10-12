"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telemetry = void 0;
const winston_1 = __importDefault(require("winston"));
// ✅ Explicitly imports the clean transport class to satisfy the compiler
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// ❶ Configure the Daily File Archiving Transport
// This automatically slices logs by day, compresses them into .gz archives, and auto-deletes old files after 14 days
// Change: new winston.transports.DailyRotateFile({
// To:
const dailyRotateFileTransport = new winston_daily_rotate_file_1.default({
    filename: "logs/adept-telemetry-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
});
// ❷ Create Core Telemetry Instance
exports.telemetry = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transports: [
        dailyRotateFileTransport,
        // Add local terminal support for developers
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
    ],
});
