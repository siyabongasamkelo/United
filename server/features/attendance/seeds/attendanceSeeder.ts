// 📂 File: server/src/features/attendance/seeds/attendanceSeeder.ts
import { AttendanceLog } from "../models/AttendanceLog";
import mongoose from "mongoose";

export interface IAttendanceSeedDependencies {
  branchId: string;
  userId: string;
}

export async function runAttendanceSeed(
  dependencies: IAttendanceSeedDependencies,
) {
  try {
    console.log("⌚ Attendance Seeder: Purging chronological logs...");
    await AttendanceLog.deleteMany({});

    console.log("🌱 Injecting 6 compliant cross-lifecycle shift records...");

    const branchObjId = new mongoose.Types.ObjectId(dependencies.branchId);
    const userObjId = new mongoose.Types.ObjectId(dependencies.userId);

    const logsToSeed = [
      // 1. Completed Morning Shift Lifecycle
      {
        user: userObjId,
        branch: branchObjId,
        shiftWave: "MORNING" as const,
        status: "CLOCKED_OUT" as const,
        clockInTime: new Date(Date.now() - 32 * 60 * 60 * 1000), // Yesterday morning
        latitude: -26.1952, // Gauteng Mall Anchor
        longitude: 28.0341,
        isGeofenceVerified: true,
        ppeDeclaration: {
          hasSafetyBoots: true,
          hasReflectorVest: true,
          hasSteeringRope: true,
        },
        ppeSelfieUrl: "https://unitedtrolley.co.za",
        clockOutTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        clockOutLatitude: -26.1954,
        clockOutLongitude: 28.0343,
        telemetry: { batteryLevel: 0.85, platform: "iOS" },
        shiftNotes: "Morning shift completed seamlessly. All rows locked down.",
      },
      // 2. Active Morning Shift Lifecycle (Currently Working)
      {
        user: userObjId,
        branch: branchObjId,
        shiftWave: "MORNING" as const,
        status: "ACTIVE" as const,
        clockInTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        latitude: -26.1952,
        longitude: 28.0341,
        isGeofenceVerified: true,
        ppeDeclaration: {
          hasSafetyBoots: true,
          hasReflectorVest: true,
          hasSteeringRope: true,
        },
        ppeSelfieUrl: "https://unitedtrolley.co.za",
        telemetry: { batteryLevel: 0.94, platform: "Android" },
      },
      // 3. Reinforcement Shift currently on a Break
      {
        user: userObjId,
        branch: branchObjId,
        shiftWave: "REINFORCEMENT" as const,
        status: "BREAK" as const,
        clockInTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        latitude: -26.195,
        longitude: 28.0345,
        isGeofenceVerified: true,
        ppeDeclaration: {
          hasSafetyBoots: true,
          hasReflectorVest: true,
          hasSteeringRope: true,
        },
        ppeSelfieUrl: "https://unitedtrolley.co.za",
        telemetry: { batteryLevel: 0.52, platform: "Android" },
        shiftNotes:
          "Mid-day rush cleared. Stepped away for official lunch break.",
      },
      // 4. Completed Night Sweepers Shift with Device Telemetry Data
      {
        user: userObjId,
        branch: branchObjId,
        shiftWave: "NIGHT_SWEEPERS" as const,
        status: "CLOCKED_OUT" as const,
        clockInTime: new Date(Date.now() - 56 * 60 * 60 * 1000),
        latitude: -26.1952,
        longitude: 28.0341,
        isGeofenceVerified: true,
        ppeDeclaration: {
          hasSafetyBoots: true,
          hasReflectorVest: true,
          hasSteeringRope: true,
        },
        ppeSelfieUrl: "https://unitedtrolley.co.za",
        clockOutTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
        clockOutLatitude: -26.1953,
        clockOutLongitude: 28.034,
        telemetry: { batteryLevel: 0.12, platform: "iOS" },
        shiftNotes: "Low battery alert triggered right before clocking out.",
      },
      // 5. Historical Record: Completed Reinforcement Shift
      {
        user: userObjId,
        branch: branchObjId,
        shiftWave: "REINFORCEMENT" as const,
        status: "CLOCKED_OUT" as const,
        clockInTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
        latitude: -26.1952,
        longitude: 28.0341,
        isGeofenceVerified: true,
        ppeDeclaration: {
          hasSafetyBoots: true,
          hasReflectorVest: true,
          hasSteeringRope: true,
        },
        ppeSelfieUrl: "https://unitedtrolley.co.za",
        clockOutTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        clockOutLatitude: -26.1951,
        clockOutLongitude: 28.0342,
        telemetry: { batteryLevel: 0.45, platform: "Android" },
      },
      // 6. Upcoming/Fresh Night Sweepers Shift Setup (Just Started)
      {
        user: userObjId,
        branch: branchObjId,
        shiftWave: "NIGHT_SWEEPERS" as const,
        status: "ACTIVE" as const,
        clockInTime: new Date(), // Live stamp right now
        latitude: -26.1952,
        longitude: 28.0341,
        isGeofenceVerified: true,
        ppeDeclaration: {
          hasSafetyBoots: true,
          hasReflectorVest: true,
          hasSteeringRope: true,
        },
        ppeSelfieUrl: "https://unitedtrolley.co.za",
        telemetry: { batteryLevel: 0.99, platform: "iOS" },
        shiftNotes:
          "Locking terminal entrance bays down for night sweeping parameters.",
      },
    ];

    const seededLogs = await AttendanceLog.create(logsToSeed);
    console.log(
      `✅ Success: ${seededLogs.length} attendance vector tracks seeded cleanly.`,
    );
  } catch (error) {
    console.error("❌ Attendance Seeder run failed:", error);
    throw error;
  }
}
