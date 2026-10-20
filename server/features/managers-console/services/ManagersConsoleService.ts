import { FleetAudit } from "../../fleet-audit/models/FleetAudit";
import { AttendanceLog } from "../../attendance/models/AttendanceLog";
import { StoreVisit } from "../../store-visits/models/StoreVisit";
import { Types } from "mongoose";
import { telemetry } from "../../../shared/telemetry/logger";

export class ManagersConsoleService {
  async getBranchPerformanceSummary(branchId: any) {
    const startTime = performance.now();

    // 1. Safe Object ID parsing logic for Area Managers
    const branchObjectId =
      branchId instanceof Types.ObjectId
        ? branchId
        : new Types.ObjectId(String(branchId));

    // ❷ BULLETPROOF AGGREGATION LOOKUP (No more strict daily date windows!)
    // This finds only the absolute latest audit logged for each individual store in this branch
    const [latestStoreAudits, livePersonnel] = await Promise.all([
      FleetAudit.aggregate([
        // Filter data down strictly to this branch hub
        { $match: { branch: branchObjectId } },

        // Sort globally so the absolute newest entries bubble straight to the top
        { $sort: { auditDate: -1, createdAt: -1 } },

        // Group by the unique store identifier and isolate the first (newest) record's snapshot values
        {
          $group: {
            _id: "$store",
            latestAuditId: { $first: "$_id" },
            auditDate: { $first: "$auditDate" },
            metrics: { $first: "$metrics" },
            notes: { $first: "$notes" },
          },
        },

        // Join onto the master 'stores' collection to pull down display names dynamically
        {
          $lookup: {
            from: "stores",
            localField: "_id",
            foreignField: "_id",
            as: "storeDetails",
          },
        },
        { $unwind: "$storeDetails" },
      ]),

      // Keep your live porter lookups active so you can track who is on the ground
      AttendanceLog.find({
        branch: branchObjectId,
        status: "ACTIVE",
      })
        .populate("user", "fullName contactNumber role")
        .lean(),
    ]);

    // ❸ MAP OUT DYNAMIC STORE BLOCKS FOR THE UI GRID
    // This dynamically builds the dashboard arrays regardless of how many stores are in the branch
    // ❸ MAP OUT DYNAMIC STORE BLOCKS FOR THE UI GRID
    const storesData = latestStoreAudits.map((audit: any) => {
      const currentTotal = audit.metrics?.total || 0;
      const damagedCount = audit.metrics?.damaged || 0;
      const dirtyCount = audit.metrics?.dirty || 0;

      // Calculate operational usable count safely on the fly
      const operationalCount = Math.max(
        0,
        currentTotal - damagedCount - dirtyCount,
      );

      return {
        storeId: String(audit._id),
        auditId: String(audit.latestAuditId),
        // 💥 FIX: Changed from database syntax to regular JavaScript string uppercase mapping!
        storeName: String(
          audit.storeDetails?.name || "Unknown Store",
        ).toUpperCase(),
        lastUpdated: audit.auditDate,
        metrics: {
          totalRegisteredFleet: currentTotal,
          operationalUsable: operationalCount,
          activeDirty: dirtyCount,
          activeBroken: damagedCount,
        },
        notes: audit.notes || "",
      };
    });

    // ❹ ACCUMULATE GLOBAL HUB TOTALS (For the top executive dashboard cards)
    const globalMetrics = storesData.reduce(
      (acc, store) => {
        acc.totalRegisteredFleet += store.metrics.totalRegisteredFleet;
        acc.operationalUsable += store.metrics.operationalUsable;
        acc.activeDirty += store.metrics.activeDirty;
        acc.activeBroken += store.metrics.activeBroken;
        return acc;
      },
      {
        totalRegisteredFleet: 0,
        operationalUsable: 0,
        activeDirty: 0,
        activeBroken: 0,
      },
    );

    const fleetEfficiencyRate =
      globalMetrics.totalRegisteredFleet > 0
        ? Math.round(
            (globalMetrics.operationalUsable /
              globalMetrics.totalRegisteredFleet) *
              100,
          )
        : 0;

    // ❺ SYSTEM MONITORING TELEMETRY LOG ENTRY
    telemetry.info({
      event: "MANAGERS_CONSOLE_SUMMARY_COMPILED",
      branchId: String(branchObjectId),
      durationMs: Math.round(performance.now() - startTime),
    });

    return {
      branchId: String(branchObjectId),
      metrics: {
        ...globalMetrics,
        efficiencyRatePercentage: fleetEfficiencyRate,
      },
      // Send the dynamic list straight down to the frontend layout mapper loop
      stores: storesData,
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
    };
  }
}
