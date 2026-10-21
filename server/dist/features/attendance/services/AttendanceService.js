"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
// 📂 File: features/attendance/services/AttendanceService.ts
const AttendanceRepository_1 = require("../repositories/AttendanceRepository");
const Branch_1 = require("../../branch/models/Branch"); // 🚀 Linked your dynamic Branch model context
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
        const validatedInput = attendanceValidation_1.clockInPayloadSchema.parse(payload);
        // 1. Fetch the target branch document profile to recover true server coordinate matrices
        const targetBranch = await Branch_1.Branch.findById(validatedInput.branchId);
        if (!targetBranch) {
            throw (0, errorMiddleware_1.createAppError)("Operational shift setup failed. Target branch boundary record missing.", 404);
        }
        // 2. Perform dynamic vector distance calculation mapping
        const distanceMeters = this.attendanceRepo.calculateDistance(validatedInput.latitude, validatedInput.longitude, targetBranch.coordinates.latitude, targetBranch.coordinates.longitude);
        const isInsideBoundary = distanceMeters <= this.attendanceRepo.getGeofenceThreshold();
        if (!isInsideBoundary) {
            throw (0, errorMiddleware_1.createAppError)(`Geofence Access Denied: Located ${Math.round(distanceMeters)}m away. Shift profile rules require you to stand within 200m of ${targetBranch.name} to check in.`, 403);
        }
        const savedLog = await this.attendanceRepo.createLog({
            user: workerUserId,
            branch: validatedInput.branchId,
            shiftWave: validatedInput.shiftWave,
            status: "ACTIVE",
            latitude: validatedInput.latitude,
            longitude: validatedInput.longitude,
            isGeofenceVerified: true,
            ppeDeclaration: validatedInput.ppeDeclaration,
        });
        logger_1.telemetry.info({
            event: "WORKER_SHIFT_CLOCKED_IN",
            logId: savedLog._id,
            userId: workerUserId,
            shiftWave: savedLog.shiftWave,
            durationMs: Math.round(performance.now() - startTime),
        });
        return savedLog;
    }
    async registerClockOut(workerUserId, branchId, coordinates) {
        const startTime = performance.now();
        // 1. Fetch branch settings for dynamic clock-out boundary validation checks
        const targetBranch = await Branch_1.Branch.findById(branchId);
        if (!targetBranch) {
            throw (0, errorMiddleware_1.createAppError)("Shift wrap-up failed. Target branch boundary record missing.", 404);
        }
        // 2. Enforce structural clock-out geofencing arrays
        const distanceMeters = this.attendanceRepo.calculateDistance(coordinates.latitude, coordinates.longitude, targetBranch.coordinates.latitude, targetBranch.coordinates.longitude);
        if (distanceMeters > this.attendanceRepo.getGeofenceThreshold()) {
            throw (0, errorMiddleware_1.createAppError)(`Geofence Access Denied: Cannot clock out. You are located ${Math.round(distanceMeters)}m away from the operational footprint of ${targetBranch.name}.`, 403);
        }
        const updatedLog = await this.attendanceRepo.finalizeClockOut(workerUserId, branchId, coordinates);
        if (!updatedLog) {
            throw (0, errorMiddleware_1.createAppError)("Shift tracking update failed. No active shift log found for your user profile matching today's timeline gate.", 404);
        }
        logger_1.telemetry.info({
            event: "WORKER_SHIFT_CLOCKED_OUT",
            logId: updatedLog._id,
            userId: workerUserId,
            branchId,
            durationMs: Math.round(performance.now() - startTime),
        });
        return updatedLog;
    }
    async fetchUserLogsForDay(userId) {
        return await this.attendanceRepo.findPersonalLogsToday(userId);
    }
    async getLiveFloorPersonnel(branchId) {
        if (!branchId || branchId === "undefined") {
            throw (0, errorMiddleware_1.createAppError)("Branch tracking parameter boundary reference context is mandatory.", 400);
        }
        return await this.attendanceRepo.findActivePortersToday(branchId);
    }
}
exports.AttendanceService = AttendanceService;
