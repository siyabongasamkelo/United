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

    // 1. Runtime schema structure checking via Zod definitions
    const validatedInput: ClockInInput = clockInPayloadSchema.parse(payload);

    // 2. Perform Geofence Validation Math
    const distanceMeters = this.attendanceRepo.calculateDistanceToGateway(
      validatedInput.latitude,
      validatedInput.longitude,
    );

    const isInsideMallBoundary =
      distanceMeters <= this.attendanceRepo.getGeofenceThreshold();

    // Strict Compliance Gatekeeper Rule: Block clock-in if they are buddy-logging from outside the mall lanes
    if (!isInsideMallBoundary) {
      throw createAppError(
        `Geofence Access Denied: You are physically located ${Math.round(distanceMeters)}m away. You must be within a 200m radius of Gateway Theatre of Shopping to register your shift.`,
        403,
      );
    }

    // 3. Persist the validated record to your Atlas Cloud Database cluster
    const savedLog = await this.attendanceRepo.createLog({
      user: workerUserId as any,
      branch: validatedInput.branchId as any,
      shiftWave: validatedInput.shiftWave,
      latitude: validatedInput.latitude,
      longitude: validatedInput.longitude,
      isGeofenceVerified: true,
      ppeDeclaration: validatedInput.ppeDeclaration,
    });

    // 4. Output explicit telemetry files into your daily rotating logging frameworks
    telemetry.info({
      event: "WORKER_SHIFT_CLOCKED_IN",
      logId: savedLog._id,
      userId: workerUserId,
      shiftWave: savedLog.shiftWave,
      distanceFromAnchorMeters: Math.round(distanceMeters),
      durationMs: Math.round(performance.now() - startTime),
    });

    return savedLog;
  }

  async fetchUserLogsForDay(userId: string) {
    return await this.attendanceRepo.findPersonalLogsToday(userId);
  }
}
