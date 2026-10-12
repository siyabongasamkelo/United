"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAuditController = void 0;
const FleetAuditService_1 = require("../services/FleetAuditService");
class FleetAuditController {
    auditService;
    constructor() {
        this.auditService = new FleetAuditService_1.FleetAuditService();
    }
    /**
     * HTTP POST: Submits a fresh fleet audit record
     * Route: POST /api/v1/fleet-audits
     */
    submitAudit = async (req, res, next) => {
        try {
            // Extract the logged-in User ID attached by your authMiddleware
            const authorId = req.user?.id || req.auth?.userId;
            const result = await this.auditService.submitFleetAudit(req.body, authorId);
            res.status(201).json({
                success: true,
                message: "Fleet audit submitted and recorded successfully.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * HTTP GET: Retrieves a specific fleet audit by its MongoDB document ID
     * Route: GET /api/v1/fleet-audits/:id
     */
    getAuditById = async (req, res, next) => {
        try {
            // const dateStr = String(req.query.date)
            const idStr = String(req.params.id);
            //   const { id } = req.params;
            //   const result = await this.auditService.getAuditById(id);
            const result = await this.auditService.getAuditById(idStr);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * HTTP GET: Fetches tracking records matching a single daily date window
     * Route: GET /api/v1/fleet-audits/daily?date=2026-10-04&storeId=...
     */
    getDailyAudits = async (req, res, next) => {
        try {
            const dateStr = req.query.date;
            const storeId = req.query.storeId;
            const result = await this.auditService.getDailyAudits(dateStr, storeId);
            res.status(200).json({
                success: true,
                count: result.length,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * HTTP GET: Fetches tracking records matching a 7-day span forward from a date
     * Route: GET /api/v1/fleet-audits/weekly?startDate=2026-10-01&storeId=...
     */
    getWeeklyAudits = async (req, res, next) => {
        try {
            const startDateStr = req.query.startDate;
            const storeId = req.query.storeId;
            const result = await this.auditService.getWeeklyAudits(startDateStr, storeId);
            res.status(200).json({
                success: true,
                count: result.length,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * HTTP GET: Fetches tracking records organized by a specific calendar month
     * Route: GET /api/v1/fleet-audits/monthly?year=2026&month=10&storeId=...
     */
    getMonthlyAudits = async (req, res, next) => {
        try {
            const yearStr = req.query.year;
            const monthStr = req.query.month;
            const storeId = req.query.storeId;
            const result = await this.auditService.getMonthlyAudits(yearStr, monthStr, storeId);
            res.status(200).json({
                success: true,
                count: result.length,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * HTTP GET: Aggregates historical metrics to supply analytical pipelines and charts
     * Route: GET /api/v1/fleet-audits/analytics?startDate=2026-01-01&endDate=2026-10-04&storeId=...
     */
    getAuditAnalytics = async (req, res, next) => {
        try {
            const startDateStr = req.query.startDate;
            const endDateStr = req.query.endDate;
            const storeId = req.query.storeId;
            const result = await this.auditService.getAuditAnalytics(startDateStr, endDateStr, storeId);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.FleetAuditController = FleetAuditController;
