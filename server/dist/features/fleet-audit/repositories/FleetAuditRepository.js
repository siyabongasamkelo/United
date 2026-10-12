"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetAuditRepository = void 0;
const FleetAudit_1 = require("../models/FleetAudit");
const mongoose_1 = require("mongoose");
class FleetAuditRepository {
    /**
     * Creates a new Fleet Audit record in the database.
     */
    async create(auditData) {
        const audit = new FleetAudit_1.FleetAudit(auditData);
        return await audit.save();
    }
    /**
     * Retrieves an audit by its unique ID, populated with references.
     */
    async findById(id) {
        return await FleetAudit_1.FleetAudit.findById(id)
            .populate("store", "name code")
            .populate("branch", "name")
            .populate("company", "name")
            .populate("author", "firstName lastName email");
    }
    /**
     * Retrieves audits within a precise single-day window.
     * Matches audits from 00:00:00.000 to 23:59:59.999 of the specified date.
     */
    async findByDate(date, storeId) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const query = {
            auditDate: { $gte: startOfDay, $lte: endOfDay },
        };
        if (storeId) {
            query.store = new mongoose_1.Types.ObjectId(storeId);
        }
        return await FleetAudit_1.FleetAudit.find(query)
            .populate("store branch company author", "name firstName lastName")
            .sort({ auditDate: -1 });
    }
    /**
     * Retrieves audits for a specific week based on a given start date.
     * Grabs data spanning exactly 7 days from the provided date.
     */
    async findByWeek(startDate, storeId) {
        const startOfWeek = new Date(startDate);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startDate);
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);
        const query = {
            auditDate: { $gte: startOfWeek, $lt: endOfWeek },
        };
        if (storeId) {
            query.store = new mongoose_1.Types.ObjectId(storeId);
        }
        return await FleetAudit_1.FleetAudit.find(query)
            .populate("store branch company author", "name firstName lastName")
            .sort({ auditDate: -1 });
    }
    /**
     * Retrieves all audits for a particular month and year.
     */
    async findByMonth(year, month, storeId) {
        // Note: JavaScript months are 0-indexed (January = 0, December = 11)
        const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const query = {
            auditDate: { $gte: startOfMonth, $lte: endOfMonth },
        };
        if (storeId) {
            query.store = new mongoose_1.Types.ObjectId(storeId);
        }
        return await FleetAudit_1.FleetAudit.find(query)
            .populate("store branch company author", "name firstName lastName")
            .sort({ auditDate: -1 });
    }
    /**
     * [Bonus Function] Aggregates historical metrics to help build charts easily.
     * Calculates overall average operational, damaged, and dirty rates over a timeframe.
     */
    async getHistoricalMetrics(startDate, endDate, storeId) {
        const matchStage = {
            auditDate: { $gte: startDate, $lte: endDate },
        };
        if (storeId) {
            matchStage.store = new mongoose_1.Types.ObjectId(storeId);
        }
        return await FleetAudit_1.FleetAudit.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    avgTotalTrolleys: { $avg: "$metrics.total" },
                    avgDamagedTrolleys: { $avg: "$metrics.damaged" },
                    avgDirtyTrolleys: { $avg: "$metrics.dirty" },
                    avgOperationalTrolleys: { $avg: "$metrics.operational" },
                    totalAuditsPerformed: { $sum: 1 },
                },
            },
        ]);
    }
}
exports.FleetAuditRepository = FleetAuditRepository;
