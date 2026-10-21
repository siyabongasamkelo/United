// 📂 File: src/features/manager-console/services/ManagersConsoleService.ts
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

    // Calculate strict dynamic bounds for today's operational shift window
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // ❷ BULLETPROOF HIGH-SPEED PARALLEL MULTI-TABLE LOOKUP GATES
    // We fetch our fleet balance metrics snapshots, live active rosters, and the performance rankings!
    const [latestStoreAudits, livePersonnel, porterPerformanceAggregates] =
      await Promise.all([
        // A. Fleet Audit Snapshots per unique storefront
        FleetAudit.aggregate([
          { $match: { branch: branchObjectId } },
          { $sort: { auditDate: -1, createdAt: -1 } },
          {
            $group: {
              _id: "$store",
              latestAuditId: { $first: "$_id" },
              auditDate: { $first: "$auditDate" },
              metrics: { $first: "$metrics" },
              notes: { $first: "$notes" },
            },
          },
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

        // B. Live active personnel checked in via the geofence portal
        AttendanceLog.find({
          branch: branchObjectId,
          status: "ACTIVE",
        })
          .populate("user", "fullName contactNumber role")
          .lean(),

        // C. 🎯 NEW EXPOSURE ENGINE: Aggregates chronological store sweeps, totals, and hourly frequency tracking metrics!
        StoreVisit.aggregate([
          {
            $match: {
              branch: branchObjectId,
              scannedAt: { $gte: startOfToday, $lte: endOfToday },
            },
          },
          {
            $group: {
              _id: "$porter",
              totalScans: { $sum: 1 },
              firstScanTime: { $min: "$scannedAt" },
              lastScanTime: { $max: "$scannedAt" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "porterProfile",
            },
          },
          { $unwind: "$porterProfile" },
        ]),
      ]);

    // ❸ MAP OUT DYNAMIC STORE BLOCKS FOR THE UI GRID
    const storesData = latestStoreAudits.map((audit: any) => {
      const currentTotal = audit.metrics?.total || 0;
      const damagedCount = audit.metrics?.damaged || 0;
      const dirtyCount = audit.metrics?.dirty || 0;
      const operationalCount = Math.max(
        0,
        currentTotal - damagedCount - dirtyCount,
      );

      return {
        storeId: String(audit._id),
        auditId: String(audit.latestAuditId),
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

    // ❹ ACCUMULATE GLOBAL HUB TOTALS FOR EXECUTIVE METRICS CARDS
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

    // ❺ COMPILE THE HOURLY FREQUENCY LEADERBOARD
    // Loops over the aggregates and calculates dynamic speeds using JavaScript time values
    const performanceLeaderboard = porterPerformanceAggregates
      .map((record: any) => {
        const firstScan = new Date(record.firstScanTime).getTime();
        const lastScan = new Date(record.lastScanTime).getTime();

        // Calculate active duty time span between their first and last scan in hours
        // Fallback baseline to 1 hour to prevent dividing by zero errors if they only scanned once
        const activeDurationHours = Math.max(
          1,
          (lastScan - firstScan) / (1000 * 60 * 60),
        );
        const calculatedFrequency =
          Math.round((record.totalScans / activeDurationHours) * 10) / 10;

        return {
          porterId: String(record._id),
          fullName: String(record.porterProfile.fullName || "Field Porter"),
          totalScansToday: record.totalScans,
          scansPerHour: calculatedFrequency, // 🕒 Live frequency measurement metric calculation!
          lastScanLoggedAt: record.lastScanTime,
        };
      })
      .sort((a, b) => b.totalScansToday - a.totalScansToday); // Top performers bubble up to the apex naturally!

    // ❻ SYSTEM MONITORING TELEMETRY LOG ENTRY
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
      stores: storesData,
      // 🚀 EXPOSING TARGET SCANS DIRECTLY DOWN THE DISPATCH PIPE WIRE PAYLOAD CONTRACT
      porterPerformanceRankings: performanceLeaderboard,
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
