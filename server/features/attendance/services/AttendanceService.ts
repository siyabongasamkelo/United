// 📂 File: features/attendance/services/AttendanceService.ts
import { AttendanceRepository } from "../repositories/AttendanceRepository";
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

    const distanceMeters = this.attendanceRepo.calculateDistanceToGateway(
      validatedInput.latitude,
      validatedInput.longitude,
    );

    const isInsideMallBoundary =
      distanceMeters <= this.attendanceRepo.getGeofenceThreshold();

    if (!isInsideMallBoundary) {
      throw createAppError(
        `Geofence Access Denied: You are physically located ${Math.round(distanceMeters)}m away. You must be within a 200m radius of Gateway Theatre of Shopping to register your shift.`,
        403,
      );
    }

    const savedLog = await this.attendanceRepo.createLog({
      user: workerUserId as any,
      branch: validatedInput.branchId as any,
      shiftWave: validatedInput.shiftWave,
      status: "ACTIVE", // 🚀 Explicitly initialize as active
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

  /**
   * 🆕 NEW LIFECYCLE HANDLER: Validates position and triggers shift termination
   */
  async registerClockOut(
    workerUserId: string,
    branchId: string,
    coordinates: { latitude: number; longitude: number },
  ) {
    const startTime = performance.now();

    // Geofence enforcement on clock-out to ensure they are on site
    const distanceMeters = this.attendanceRepo.calculateDistanceToGateway(
      coordinates.latitude,
      coordinates.longitude,
    );

    if (distanceMeters > this.attendanceRepo.getGeofenceThreshold()) {
      throw createAppError(
        `Geofence Access Denied: Cannot clock out. You are located ${Math.round(distanceMeters)}m away from the operational hub footprint.`,
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

  /**
   * 🚀 SYSTEM CROSS-TALK BRIDGE: Feeds your decoupled manager feature flawlessly
   */
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
