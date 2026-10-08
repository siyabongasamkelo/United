import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { requestLogger } from "./shared/middleware/loggerMiddleware";
import { errorHandler } from "./shared/middleware/errorMiddleware";
import userRoutes from "./features/users/routes/userRoutes";
import fleetAuditRoutes from "./features/fleet-audit/routes/fleetAuditRoutes";
import safteyQuizzesRoutes from "./features/safety-quizzes/routes/quizRoutes";
import fixReportRoutes from "./features/fix-report/routes/fixReport.routes";
import { telemetry } from "./shared/telemetry/logger";
import adminRouter from "./features/store/routes/store.routes";

// Initialize environment configuration variables
dotenv.config();

const app = express();

// ❶ Global Gate Interceptors & Security Setup
app.use(cors());
app.use(express.json());

// Mount our production structured telemetry request tracker at the absolute API gate
app.use(requestLogger);

// ❷ Feature Module Route Allocations
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/fleet-audits", fleetAuditRoutes);
app.use("/api/v1/safety-quizzes", safteyQuizzesRoutes);
app.use("/api/v1/fix-report", fixReportRoutes);
app.use("/api/v1/admin", adminRouter);
// A simple system health ping to ensure the server core is running
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ONLINE",
    system: "ADEPT CORE ENGINE",
    timestamp: new Date(),
  });
});

// ❸ Fallback Centralized Global Error Middleware (Must sit beneath all route definitions)
app.use(errorHandler);

// ❹ Database Connection & Server Initialization Boot Sequence
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:21017/adept_ops";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    telemetry.info("🏛️ Central MongoDB Cluster connected successfully.");
    app.listen(PORT, () => {
      telemetry.info(
        `🚀 ADEPT Operational Backend live and listening on network port: ${PORT}`,
      );
    });
  })
  .catch((error) => {
    telemetry.error(`❌ Database bootstrap crash: ${error.message}`);
    process.exit(1);
  });
