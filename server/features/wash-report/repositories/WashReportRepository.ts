import { WashReport, IWashReport } from "../models/WashReport";

export class WashReportRepository {
  async saveReport(reportData: Partial<IWashReport>): Promise<IWashReport> {
    const report = new WashReport(reportData);
    return await report.save();
  }

  async bulkResolveStoreWashQueue(
    storeId: string,
  ): Promise<{ modifiedCount: number }> {
    const result = await WashReport.updateMany(
      {
        storeOrigin: storeId,
        washStatus: { $in: ["PENDING_WASH", "IN_WASH_BAY"] }, // Only target active tickets
      },
      {
        $set: { washStatus: "CLEANED" },
      },
    );

    return { modifiedCount: result.modifiedCount };
  }

  // Returns live washing queues, populating user details and store data origins cleanly
  async findActiveWashQueue(): Promise<IWashReport[]> {
    return await WashReport.find({
      washStatus: { $in: ["PENDING_WASH", "IN_WASH_BAY"] },
    })
      .populate("reportedBy", "firstName lastName staffNumber email")
      .populate("storeOrigin", "name code")
      .sort({ createdAt: -1 });
  }

  async updateWashStatus(
    reportId: string,
    status: string,
  ): Promise<IWashReport | null> {
    return await WashReport.findByIdAndUpdate(
      reportId,
      { washStatus: status },
      { new: true },
    );
  }

  // Gives workshop managers metrics on why trolleys are ending up out of action
  async getContaminationMetrics() {
    return await WashReport.aggregate([
      {
        $group: {
          _id: "$contaminationType",
          totalIncidents: { $sum: 1 },
          highPriorityCount: {
            $sum: { $cond: [{ $eq: ["$washPriority", "HIGH"] }, 1, 0] },
          },
        },
      },
    ]);
  }
}
