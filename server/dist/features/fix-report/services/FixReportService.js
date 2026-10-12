"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixReportService = void 0;
const FixReportRepository_1 = require("../repositories/FixReportRepository");
const fixReportValidation_1 = require("../validations/fixReportValidation");
const errorMiddleware_1 = require("../../../shared/middleware/errorMiddleware");
const logger_1 = require("../../../shared/telemetry/logger");
class FixReportService {
    fixReportRepo;
    constructor() {
        this.fixReportRepo = new FixReportRepository_1.FixReportRepository();
    }
    async processNewFaultReport(payload, managerUserId) {
        const startTime = performance.now();
        // 1. Validate incoming data body properties via Zod schema checks
        const validatedInput = fixReportValidation_1.createFixReportPayloadSchema.parse(payload);
        // 2. Transmit and map data properties into the storage structure layout definitions
        const createdLog = await this.fixReportRepo.saveReport({
            trolleyId: validatedInput.trolleyId,
            storeOrigin: validatedInput.storeOriginId,
            brokenComponent: validatedInput.brokenComponent,
            damageSeverity: validatedInput.damageSeverity,
            reportedBy: managerUserId,
            notes: validatedInput.notes,
            evidenceImageUrl: validatedInput.evidenceImageUrl,
        });
        // 3. Issue structural winston execution logs out to tracking containers
        logger_1.telemetry.info({
            event: "ASSET_FAULT_REGISTERED",
            reportId: createdLog._id,
            trolleyId: createdLog.trolleyId,
            component: createdLog.brokenComponent,
            reportedBy: managerUserId,
            durationMs: Math.round(performance.now() - startTime),
        });
        return createdLog;
    }
    async retrieveActiveQueue() {
        return await this.fixReportRepo.findActiveMaintenanceQueue();
    }
    async transitionAssetStatus(reportId, status) {
        const tracking = await this.fixReportRepo.updateReportStatus(reportId, status);
        if (!tracking) {
            throw (0, errorMiddleware_1.createAppError)("The specified asset maintenance record could not be found.", 404);
        }
        return tracking;
    }
}
exports.FixReportService = FixReportService;
