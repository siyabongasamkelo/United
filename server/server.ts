import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { requestLogger } from "./shared/middleware/loggerMiddleware";
import { errorHandler } from "./shared/middleware/errorMiddleware";
import userRoutes from "./features/users/routes/userRoutes";
import { telemetry } from "./shared/telemetry/logger";

// Initialize environment configuration variables
dotenv.config();

const app = express();

// ❶ Global Gate Interceptors & Security Setup
app.use(cors());
app.use(express.json());

// Mount our production structured telemetry request tracker at the absolute API gate
app.use(requestLogger);

// ❷ Feature Module Route Allocations
app.use("/api/users", userRoutes);

// A simple system health ping to ensure the server core is running
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({
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
