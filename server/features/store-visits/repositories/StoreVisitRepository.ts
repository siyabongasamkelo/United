import { StoreVisit, IStoreVisit } from "../models/StoreVisit";
import { Types } from "mongoose";

export class StoreVisitRepository {
  /**
   * ❶ Create a new verified or flagged store visit record.
   * This is triggered the millisecond a porter scans a valid QR code on the floor.
   */
  async create(visitData: Partial<IStoreVisit>): Promise<IStoreVisit> {
    const visit = new StoreVisit(visitData);
    return await visit.save();
  }

  /**
   * ❷ Find a single visit document by ID with fully populated relationship links.
   * Used for supervisor detail inspection views.
   */
  async findById(id: string): Promise<IStoreVisit | null> {
    return await StoreVisit.findById(id)
      .populate("porter", "firstName lastName email employeeId role")
      .populate("store", "name storeCode coordinates")
      .populate("branch", "name branchCode");
  }

  /**
   * ❸ Track a specific Porter's timeline for a single daily window.
   * Crucial for answering: "What did Porter X actually do during their shift today?"
   */
  async findByPorterAndDate(
    porterId: string,
    date: Date,
  ): Promise<IStoreVisit[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await StoreVisit.find({
      porter: new Types.ObjectId(porterId),
      scannedAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("store", "name storeCode")
      .sort({ scannedAt: -1 }); // Newest sweeps show up first
  }

  /**
   * ❹ Track a specific Store's sweep log for a custom timeframe.
   * Bulletproof revenue leverage: Gives you the exact data to print out and hand to
   * the Game Store or Dis-Chem manager to prove your team is sweeping their bay every 30 mins.
   */
  async findByStoreAndDateRange(
    storeId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IStoreVisit[]> {
    return await StoreVisit.find({
      store: new Types.ObjectId(storeId),
      scannedAt: { $gte: startDate, $lte: endDate },
    })
      .populate("porter", "firstName lastName")
      .sort({ scannedAt: -1 });
  }

  /**
   * ❺ Flag-Drop Analytics: Fetch all instances of verification failures.
   * Security perimeter control: Instantly isolates entries where distanceDelta blew past the
   * geofence threshold so supervisors can catch workers sitting in the parking lot scanning copies.
   */
  async findFraudAlertsByBranch(
    branchId: string,
    limit: number = 50,
  ): Promise<IStoreVisit[]> {
    return await StoreVisit.find({
      branch: new Types.ObjectId(branchId),
      verificationStatus: { $in: ["LOCATION_MISMATCH", "FAILED_TELEMETRY"] },
    })
      .populate("porter", "firstName lastName employeeId")
      .populate("store", "name")
      .sort({ scannedAt: -1 })
      .limit(limit);
  }

  /**
   * ❻ [Bonus Analytical Aggregation] Performance Rankings for Corporate Tenders.
   * Compiles total sweep counts, verification success rates, and average distance deltas
   * grouped by porter. This gives you raw numeric charts for your client review meetings.
   */
  async getPorterSummaryMetrics(
    branchId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return await StoreVisit.aggregate([
      {
        $match: {
          branch: new Types.ObjectId(branchId),
          scannedAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$porter",
          totalScansAttempted: { $sum: 1 },
          verifiedScansCount: {
            $sum: {
              $cond: [{ $eq: ["$verificationStatus", "VERIFIED"] }, 1, 0],
            },
          },
          fraudBypassesBlocked: {
            $sum: {
              $cond: [
                { $eq: ["$verificationStatus", "LOCATION_MISMATCH"] },
                1,
                0,
              ],
            },
          },
          averageDistanceOffMeters: { $avg: "$distanceDelta" },
        },
      },
      {
        $lookup: {
          from: "users", // Matches your local database User collection index name
          localField: "_id",
          foreignField: "_id",
          as: "porterProfile",
        },
      },
      { $unwind: "$porterProfile" },
      {
        $project: {
          _id: 1,
          totalScansAttempted: 1,
          verifiedScansCount: 1,
          fraudBypassesBlocked: 1,
          averageDistanceOffMeters: {
            $round: ["$averageDistanceOffMeters", 1],
          },
          porterName: {
            $concat: [
              "$porterProfile.firstName",
              " ",
              "$porterProfile.lastName",
            ],
          },
          employeeCode: "$porterProfile.employeeId",
        },
      },
      { $sort: { verifiedScansCount: -1 } }, // Top-performing porters sit right at the apex
    ]);
  }
}
