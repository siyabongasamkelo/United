"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const loggerMiddleware_1 = require("./shared/middleware/loggerMiddleware");
const errorMiddleware_1 = require("./shared/middleware/errorMiddleware");
const userRoutes_1 = __importDefault(require("./features/users/routes/userRoutes"));
const fleetAuditRoutes_1 = __importDefault(require("./features/fleet-audit/routes/fleetAuditRoutes"));
const quizRoutes_1 = __importDefault(require("./features/safety-quizzes/routes/quizRoutes"));
const fixReport_routes_1 = __importDefault(require("./features/fix-report/routes/fixReport.routes"));
const logger_1 = require("./shared/telemetry/logger");
const store_routes_1 = __importDefault(require("./features/store/routes/store.routes"));
const attendance_routes_1 = __importDefault(require("./features/attendance/routes/attendance.routes"));
const store_routes_2 = __importDefault(require("./features/store/routes/store.routes"));
const storeVisitRoutes_1 = __importDefault(require("./features/store-visits/routes/storeVisitRoutes"));
const washReportRoutes_1 = __importDefault(require("./features/wash-report/routes/washReportRoutes"));
const managersConsole_routes_1 = __importDefault(require("./features/managers-console/routes/managersConsole.routes"));
// Initialize environment configuration variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// ❶ Global Gate Interceptors & Security Setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount our production structured telemetry request tracker at the absolute API gate
app.use(loggerMiddleware_1.requestLogger);
// ❷ Feature Module Route Allocations
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/fleet-audits", fleetAuditRoutes_1.default);
app.use("/api/v1/safety-quizzes", quizRoutes_1.default);
app.use("/api/v1/fix-reports", fixReport_routes_1.default);
app.use("/api/v1/attendance", attendance_routes_1.default);
app.use("/api/v1/admin", store_routes_1.default);
app.use("/api/v1/stores", store_routes_2.default);
app.use("/api/v1/store-visits", storeVisitRoutes_1.default);
app.use("/api/v1/wash-report", washReportRoutes_1.default);
app.use("/api/v1/managers-console", managersConsole_routes_1.default);
// A simple system health ping to ensure the server core is running
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ONLINE",
        system: "ADEPT CORE ENGINE",
        timestamp: new Date(),
    });
});
// ❸ Fallback Centralized Global Error Middleware (Must sit beneath all route definitions)
app.use(errorMiddleware_1.errorHandler);
// ❹ Database Connection & Server Initialization Boot Sequence
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:21017/adept_ops";
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    logger_1.telemetry.info("🏛️ Central MongoDB Cluster connected successfully.");
    app.listen(PORT, () => {
        logger_1.telemetry.info(`🚀 ADEPT Operational Backend live and listening on network port: ${PORT}`);
    });
})
    .catch((error) => {
    logger_1.telemetry.error(`❌ Database bootstrap crash: ${error.message}`);
    process.exit(1);
});
