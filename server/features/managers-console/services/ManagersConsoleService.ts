import { FleetAudit } from "../../fleet-audit/models/FleetAudit";
import { FixReport } from "../../fix-report/models/FixReport";
import { WashReport } from "../../wash-report/models/WashReport";
import { AttendanceLog } from "../../attendance/models/AttendanceLog"; // 🚀 Added model import
import { StoreVisit } from "../../store-visits/models/StoreVisit"; // 🚀 Added model import
import { Types } from "mongoose";
import { telemetry } from "../../../shared/telemetry/logger";

export class ManagersConsoleService {
  async getBranchPerformanceSummary(branchId: any) {
    const startTime = performance.now();

    // Safe Object ID parsing logic for Area Managers
    const branchObjectId =
      branchId instanceof Types.ObjectId
        ? branchId
        : new Types.ObjectId(String(branchId));

    // Define time window boundaries for today's store sweeps (00:00:00 to 23:59:59)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // ❶ HIGH-SPEED PARALLEL PACKET GATHERING
    const [
      latestAudits,
      activeBrokenCount,
      activeDirtyCount,
      livePersonnel,
      storeVisitsToday,
    ] = await Promise.all([
      // 1. Fleet Audit Macro Metrics
      FleetAudit.find({ branch: branchObjectId })
        .sort({ auditDate: -1 })
        .limit(2)
        .lean(),

      // 2. Fix Reports Count
      FixReport.countDocuments({
        branchId: branchObjectId,
        maintenanceStatus: { $in: ["PENDING_REPAIR", "UNDER_MAINTENANCE"] },
      }),

      // 3. Wash Reports Count
      WashReport.countDocuments({
        branchId: branchObjectId,
        washStatus: { $in: ["PENDING_WASH", "IN_WASH_BAY"] },
      }),

      // 4. 🚀 REAL LIVE PERSONNEL LOOKUP WITH POPULATION
      AttendanceLog.find({
        branch: branchObjectId,
        status: "ACTIVE", // Only target porters currently active on the ground
      })
        .populate("user", "fullName contactNumber role") // Swapping out user ID hash for real names and phone lines
        .lean(),

      // 5. 🚀 REAL STORE VISITS PIPELINE: Aggregates counts and lookup store names
      StoreVisit.aggregate([
        {
          $match: {
            branch: branchObjectId,
            scannedAt: { $gte: startOfToday, $lte: endOfToday },
          },
        },
        {
          $group: {
            _id: "$store", // Group by raw store ID first
            visitsCount: { $sum: 1 }, // Sum up total loops/sweeps
          },
        },
        {
          $lookup: {
            from: "stores", // Query master stores collection to find names
            localField: "_id",
            foreignField: "_id",
            as: "storeDetails",
          },
        },
        {
          $unwind: "$storeDetails",
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            storeName: { $toUpper: "$storeDetails.name" }, // Standardize layout strings
            visitsCount: 1,
          },
        },
      ]),
    ]);

    // ❷ DYNAMIC LOST VARIANCE CALCULATION LOGIC
    const latestAudit =
      latestAudits && latestAudits.length > 0 ? latestAudits[0] : null;
    const previousAudit =
      latestAudits && latestAudits.length > 1 ? latestAudits[1] : null;

    const currentTotalCount = latestAudit?.metrics?.total || 0;
    const previousTotalCount = previousAudit?.metrics?.total || 0;

    let lostTrolleysCount = 0;
    if (previousAudit && currentTotalCount < previousTotalCount) {
      lostTrolleysCount = previousTotalCount - currentTotalCount;
    }

    // ❸ CORE MATHEMATICAL FORMULA
    const operationalUsableBuffer = Math.max(
      0,
      currentTotalCount -
        activeDirtyCount -
        activeBrokenCount -
        lostTrolleysCount,
    );

    const fleetEfficiencyRate =
      currentTotalCount > 0
        ? Math.round((operationalUsableBuffer / currentTotalCount) * 100)
        : 0;

    // ❹ SYSTEM MONITORING TELEMETRY LOG ENTRY
    telemetry.info({
      event: "MANAGERS_CONSOLE_SUMMARY_COMPILED",
      branchId: String(branchObjectId),
      durationMs: Math.round(performance.now() - startTime),
    });

    return {
      branchId: String(branchObjectId),
      meta: {
        lastAuditLoggedAt: latestAudit?.createdAt || null,
        previousAuditLoggedAt: previousAudit?.createdAt || null,
        hasHistoricalBaseline: !!previousAudit,
      },
      metrics: {
        totalRegisteredFleet: currentTotalCount,
        operationalUsable: operationalUsableBuffer,
        activeDirty: activeDirtyCount,
        activeBroken: activeBrokenCount,
        lostTrolleys: lostTrolleysCount,
        efficiencyRatePercentage: fleetEfficiencyRate,
      },
      auditHistorySnapshot: {
        latestAuditTotal: currentTotalCount,
        previousAuditTotal: previousTotalCount,
      },
      // 🚀 REAL DATA: Map the populated Mongoose logs to match frontend dialects safely
      livePorters: livePersonnel.map((log: any) => ({
        id: String(log._id),
        fullName: log.user?.fullName || "Field Operator",
        role:
          log.shiftWave === "MORNING"
            ? "Wave 1 - Morning Lead"
            : "Wave 2 - Reinforcement",
        phoneNumber: log.user?.contactNumber || "N/A",
        clockInTime: log.clockInTime,
      })),
      // 🚀 REAL DATA: Directly maps the aggregation results array
      storeVisitsToday: storeVisitsToday,
    };
  }
}
