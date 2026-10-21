"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixReportRepository = void 0;
const FixReport_1 = require("../models/FixReport");
class FixReportRepository {
    async saveReport(reportData) {
        const report = new FixReport_1.FixReport(reportData);
        return await report.save();
    }
    // Add this method inside your FixReportRepository class
    async bulkResolveStoreMaintenanceQueue(storeId) {
        const result = await FixReport_1.FixReport.updateMany({
            storeOrigin: storeId,
            maintenanceStatus: { $in: ["PENDING_REPAIR", "UNDER_MAINTENANCE"] }, // Target active repair tickets
        }, {
            $set: { maintenanceStatus: "RESOLVED" },
        });
        return { modifiedCount: result.modifiedCount };
    }
    // Returns live queues mapped to frontend components, populating the reporting user and store details cleanly
    async findActiveMaintenanceQueue() {
        return await FixReport_1.FixReport.find({
            maintenanceStatus: { $in: ["PENDING_REPAIR", "UNDER_MAINTENANCE"] },
        })
            .populate("reportedBy", "firstName lastName staffNumber email")
            .populate("storeOrigin", "name code")
            .sort({ createdAt: -1 });
    }
    async updateReportStatus(reportId, status) {
        return await FixReport_1.FixReport.findByIdAndUpdate(reportId, { maintenanceStatus: status }, { new: true });
    }
    // Advanced pipeline for Area Managers to see exactly what components are breaking most often
    async getComponentBreakdownMetrics() {
        return await FixReport_1.FixReport.aggregate([
            {
                $group: {
                    _id: "$brokenComponent",
                    totalIncidents: { $sum: 1 },
                    highSeverityCount: {
                        $sum: { $cond: [{ $eq: ["$damageSeverity", "HIGH"] }, 1, 0] },
                    },
                },
            },
        ]);
    }
}
exports.FixReportRepository = FixReportRepository;
