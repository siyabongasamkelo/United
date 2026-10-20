// 📂 File: features/attendance/services/AttendanceService.ts
import { AttendanceRepository } from "../repositories/AttendanceRepository";
import { Branch } from "../../branch/models/Branch"; // 🚀 Linked your dynamic Branch model context
import {
  clockInPayloadSchema,
  ClockInInput,
} from "../validations/attendanceValidation";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";

export class AttendanceService {
  private attendanceRepo: AttendanceRepository;

  constructor() {
    this.attendanceRepo = new AttendanceRepository();
  }

  async registerClockIn(payload: unknown, workerUserId: string) {
    const startTime = performance.now();
    const validatedInput: ClockInInput = clockInPayloadSchema.parse(payload);

    // 1. Fetch the target branch document profile to recover true server coordinate matrices
    const targetBranch = await Branch.findById(validatedInput.branchId);
    if (!targetBranch) {
      throw createAppError(
        "Operational shift setup failed. Target branch boundary record missing.",
        404,
      );
    }

    // 2. Perform dynamic vector distance calculation mapping
    const distanceMeters = this.attendanceRepo.calculateDistance(
      validatedInput.latitude,
      validatedInput.longitude,
      targetBranch.coordinates.latitude,
      targetBranch.coordinates.longitude,
    );

    const isInsideBoundary =
      distanceMeters <= this.attendanceRepo.getGeofenceThreshold();

    if (!isInsideBoundary) {
      throw createAppError(
        `Geofence Access Denied: Located ${Math.round(distanceMeters)}m away. Shift profile rules require you to stand within 200m of ${targetBranch.name} to check in.`,
        403,
      );
    }

    const savedLog = await this.attendanceRepo.createLog({
      user: workerUserId as any,
      branch: validatedInput.branchId as any,
      shiftWave: validatedInput.shiftWave,
      status: "ACTIVE",
      latitude: validatedInput.latitude,
      longitude: validatedInput.longitude,
      isGeofenceVerified: true,
      ppeDeclaration: validatedInput.ppeDeclaration,
    });

    telemetry.info({
      event: "WORKER_SHIFT_CLOCKED_IN",
      logId: savedLog._id,
      userId: workerUserId,
      shiftWave: savedLog.shiftWave,
      durationMs: Math.round(performance.now() - startTime),
    });

    return savedLog;
  }

  async registerClockOut(
    workerUserId: string,
    branchId: string,
    coordinates: { latitude: number; longitude: number },
  ) {
    const startTime = performance.now();

    // 1. Fetch branch settings for dynamic clock-out boundary validation checks
    const targetBranch = await Branch.findById(branchId);
    if (!targetBranch) {
      throw createAppError(
        "Shift wrap-up failed. Target branch boundary record missing.",
        404,
      );
    }

    // 2. Enforce structural clock-out geofencing arrays
    const distanceMeters = this.attendanceRepo.calculateDistance(
      coordinates.latitude,
      coordinates.longitude,
      targetBranch.coordinates.latitude,
      targetBranch.coordinates.longitude,
    );

    if (distanceMeters > this.attendanceRepo.getGeofenceThreshold()) {
      throw createAppError(
        `Geofence Access Denied: Cannot clock out. You are located ${Math.round(distanceMeters)}m away from the operational footprint of ${targetBranch.name}.`,
        403,
      );
    }

    const updatedLog = await this.attendanceRepo.finalizeClockOut(
      workerUserId,
      branchId,
      coordinates,
    );

    if (!updatedLog) {
      throw createAppError(
        "Shift tracking update failed. No active shift log found for your user profile matching today's timeline gate.",
        404,
      );
    }

    telemetry.info({
      event: "WORKER_SHIFT_CLOCKED_OUT",
      logId: updatedLog._id,
      userId: workerUserId,
      branchId,
      durationMs: Math.round(performance.now() - startTime),
    });

    return updatedLog;
  }

  async fetchUserLogsForDay(userId: string) {
    return await this.attendanceRepo.findPersonalLogsToday(userId);
  }

  async getLiveFloorPersonnel(branchId: string) {
    if (!branchId || branchId === "undefined") {
      throw createAppError(
        "Branch tracking parameter boundary reference context is mandatory.",
        400,
      );
    }
    return await this.attendanceRepo.findActivePortersToday(branchId);
  }
}
