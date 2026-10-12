"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const AttendanceRepository_1 = require("../repositories/AttendanceRepository");
const attendanceValidation_1 = require("../validations/attendanceValidation");
const errorMiddleware_1 = require("../../../shared/middleware/errorMiddleware");
const logger_1 = require("../../../shared/telemetry/logger");
class AttendanceService {
    attendanceRepo;
    constructor() {
        this.attendanceRepo = new AttendanceRepository_1.AttendanceRepository();
    }
    async registerClockIn(payload, workerUserId) {
        const startTime = performance.now();
        // 1. Runtime schema structure checking via Zod definitions
        const validatedInput = attendanceValidation_1.clockInPayloadSchema.parse(payload);
        // 2. Perform Geofence Validation Math
        const distanceMeters = this.attendanceRepo.calculateDistanceToGateway(validatedInput.latitude, validatedInput.longitude);
        const isInsideMallBoundary = distanceMeters <= this.attendanceRepo.getGeofenceThreshold();
        // Strict Compliance Gatekeeper Rule: Block clock-in if they are buddy-logging from outside the mall lanes
        if (!isInsideMallBoundary) {
            throw (0, errorMiddleware_1.createAppError)(`Geofence Access Denied: You are physically located ${Math.round(distanceMeters)}m away. You must be within a 200m radius of Gateway Theatre of Shopping to register your shift.`, 403);
        }
        // 3. Persist the validated record to your Atlas Cloud Database cluster
        const savedLog = await this.attendanceRepo.createLog({
            user: workerUserId,
            branch: validatedInput.branchId,
            shiftWave: validatedInput.shiftWave,
            latitude: validatedInput.latitude,
            longitude: validatedInput.longitude,
            isGeofenceVerified: true,
            ppeDeclaration: validatedInput.ppeDeclaration,
        });
        // 4. Output explicit telemetry files into your daily rotating logging frameworks
        logger_1.telemetry.info({
            event: "WORKER_SHIFT_CLOCKED_IN",
            logId: savedLog._id,
            userId: workerUserId,
            shiftWave: savedLog.shiftWave,
            distanceFromAnchorMeters: Math.round(distanceMeters),
            durationMs: Math.round(performance.now() - startTime),
        });
        return savedLog;
    }
    async fetchUserLogsForDay(userId) {
        return await this.attendanceRepo.findPersonalLogsToday(userId);
    }
}
exports.AttendanceService = AttendanceService;
