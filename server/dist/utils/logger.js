"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: "info", // Show 'info' and above (warn, error)
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        // 1. Write all errors to a file
        new winston_1.default.transports.File({ filename: "logs/error.log", level: "error" }),
        // 2. Write everything to a combined file
        new winston_1.default.transports.File({ filename: "logs/combined.log" }),
    ],
});
// 3. If we're NOT in production, also log to the console with colors!
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    }));
}
exports.default = logger;
