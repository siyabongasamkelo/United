import winston from "winston";
// ✅ Explicitly imports the clean transport class to satisfy the compiler
import DailyRotateFile from "winston-daily-rotate-file";

// ❶ Configure the Daily File Archiving Transport
// This automatically slices logs by day, compresses them into .gz archives, and auto-deletes old files after 14 days
// Change: new winston.transports.DailyRotateFile({
// To:
const dailyRotateFileTransport = new DailyRotateFile({
  filename: "logs/adept-telemetry-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

// ❷ Create Core Telemetry Instance
export const telemetry = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [
    dailyRotateFileTransport,
    // Add local terminal support for developers
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});
