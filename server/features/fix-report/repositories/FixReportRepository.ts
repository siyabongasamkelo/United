import { FixReport, IFixReport } from "../models/FixReport";
import { Types } from "mongoose";

export class FixReportRepository {
  async saveReport(reportData: Partial<IFixReport>): Promise<IFixReport> {
    const report = new FixReport(reportData);
    return await report.save();
  }

  // Returns live queues mapped to frontend components, populating the reporting user and store details cleanly
  async findActiveMaintenanceQueue(): Promise<IFixReport[]> {
    return await FixReport.find({
      maintenanceStatus: { $in: ["PENDING_REPAIR", "UNDER_MAINTENANCE"] },
    })
      .populate("reportedBy", "firstName lastName staffNumber email")
      .populate("storeOrigin", "name code")
      .sort({ createdAt: -1 });
  }

  async updateReportStatus(
    reportId: string,
    status: string,
  ): Promise<IFixReport | null> {
    return await FixReport.findByIdAndUpdate(
      reportId,
      { maintenanceStatus: status },
      { new: true },
    );
  }

  // Advanced pipeline for Area Managers to see exactly what components are breaking most often
  async getComponentBreakdownMetrics() {
    return await FixReport.aggregate([
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
