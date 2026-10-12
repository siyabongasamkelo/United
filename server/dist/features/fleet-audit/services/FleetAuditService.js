"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAuditService = void 0;
const FleetAuditRepository_1 = require("../repositories/FleetAuditRepository");
const fleetAuditValidation_1 = require("../validations/fleetAuditValidation");
const errorMiddleware_1 = require("../../../shared/middleware/errorMiddleware");
const logger_1 = require("../../../shared/telemetry/logger");
class FleetAuditService {
    auditRepo;
    constructor() {
        this.auditRepo = new FleetAuditRepository_1.FleetAuditRepository();
    }
    /**
     * Validates and submits a new Fleet Audit record, binding the authenticated author securely.
     */
    async submitFleetAudit(payload, authorId) {
        const startTime = performance.now();
        // Parse input using our root schema architecture layout
        const validatedInput = fleetAuditValidation_1.fleetAuditPayloadValidationSchema.parse(payload);
        // Merge validated dataset along with the system-provided author metadata
        const auditData = {
            ...validatedInput,
            auditDate: new Date(validatedInput.auditDate),
            author: authorId,
        };
        const savedAudit = await this.auditRepo.create(auditData);
        logger_1.telemetry.info({
            event: "FLEET_AUDIT_SUBMIT_SUCCESS",
            auditId: savedAudit._id,
            storeId: savedAudit.store,
            branchId: savedAudit.branch,
            authorId,
            totalTrolleys: savedAudit.metrics.total,
            durationMs: Math.round(performance.now() - startTime),
        });
        return savedAudit;
    }
    /**
     * Retrieves an audit profile by its unique ID. Throws 404 factory error if missing.
     */
    async getAuditById(id) {
        const audit = await this.auditRepo.findById(id);
        if (!audit) {
            throw (0, errorMiddleware_1.createAppError)(`Fleet audit retrieval failed. Document trace missing for ID: ${id}`, 404);
        }
        return audit;
    }
    /**
     * Fetches data records matching a specific single-day timestamp window.
     */
    async getDailyAudits(dateStr, storeId) {
        const targetDate = new Date(dateStr);
        if (isNaN(targetDate.getTime())) {
            throw (0, errorMiddleware_1.createAppError)("Invalid query parameter format. Expected a valid date string.", 400);
        }
        return await this.auditRepo.findByDate(targetDate, storeId);
    }
    /**
     * Fetches records spanning exactly 7 days forward from a starting boundary timestamp.
     */
    async getWeeklyAudits(startDateStr, storeId) {
        const startDate = new Date(startDateStr);
        if (isNaN(startDate.getTime())) {
            throw (0, errorMiddleware_1.createAppError)("Invalid query parameter format. Expected a valid start date string.", 400);
        }
        return await this.auditRepo.findByWeek(startDate, storeId);
    }
    /**
     * Fetches records organized across a complete calendar monthly span.
     */
    async getMonthlyAudits(yearStr, monthStr, storeId) {
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10); // Note: 1-indexed value received from route layer (1-12)
        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            throw (0, errorMiddleware_1.createAppError)("Invalid calendar constraints. Provide a valid numeric year and month (1-12).", 400);
        }
        // Convert to standard 0-indexed JS Month format (0-11) for internal calculations
        return await this.auditRepo.findByMonth(year, month - 1, storeId);
    }
    /**
     * Aggregates historical metrics to supply analytical pipelines.
     */
    async getAuditAnalytics(startDateStr, endDateStr, storeId) {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw (0, errorMiddleware_1.createAppError)("A comprehensive data aggregation requires matching valid date parameters.", 400);
        }
        if (start > end) {
            throw (0, errorMiddleware_1.createAppError)("Analytics calculation failed. Lower timeline gate cannot pass the higher gate constraint.", 422);
        }
        const performanceRecords = await this.auditRepo.getHistoricalMetrics(start, end, storeId);
        // Provide placeholder dashboard fallbacks if the collection is empty for the current range
        if (!performanceRecords || performanceRecords.length === 0) {
            return {
                avgTotalTrolleys: 0,
                avgDamagedTrolleys: 0,
                avgDirtyTrolleys: 0,
                avgOperationalTrolleys: 0,
                totalAuditsPerformed: 0,
            };
        }
        return performanceRecords[0];
    }
}
exports.FleetAuditService = FleetAuditService;
