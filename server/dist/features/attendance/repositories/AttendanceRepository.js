"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRepository = void 0;
// 📂 File: features/attendance/repositories/AttendanceRepository.ts
const AttendanceLog_1 = require("../models/AttendanceLog");
const mongoose_1 = require("mongoose");
class AttendanceRepository {
    MAX_RADIUS_METERS = 200; // Strict boundary constraint line
    /**
     * 🛰️ DYNAMIC HAVERSINE ENGINE
     * Computes the exact distance in meters over the Earth's surface between the worker and the specific branch profile
     */
    calculateDistance(userLat, userLng, targetLat, targetLng) {
        const EarthRadiusKm = 6371;
        const dLat = ((targetLat - userLat) * Math.PI) / 180;
        const dLng = ((targetLng - userLng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLat * Math.PI) / 180) *
                Math.cos((targetLat * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EarthRadiusKm * c * 1000; // Exact distance in meters
    }
    /**
     * PERSIST CORE SESSION: Creates a brand new clock-in transaction entry log
     */
    async createLog(logData) {
        const log = new AttendanceLog_1.AttendanceLog(logData);
        return await log.save();
    }
    /**
     * SHIFT LIFECYCLE CLOSURE: Updates an existing active record with clock-out coordinates and timestamps
     */
    async finalizeClockOut(userId, branchId, clockOutData) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        return await AttendanceLog_1.AttendanceLog.findOneAndUpdate({
            user: new mongoose_1.Types.ObjectId(userId),
            branch: new mongoose_1.Types.ObjectId(branchId),
            status: "ACTIVE",
            clockInTime: { $gte: startOfToday, $lte: endOfToday },
        }, {
            $set: {
                status: "CLOCKED_OUT",
                clockOutTime: new Date(),
                clockOutLatitude: clockOutData.latitude,
                clockOutLongitude: clockOutData.longitude,
            },
        }, { new: true });
    }
    /**
     * PERSONAL LOG RECOVERY: Fetches all history entries logged by a single user within the current day
     */
    async findPersonalLogsToday(userId) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        return await AttendanceLog_1.AttendanceLog.find({
            user: new mongoose_1.Types.ObjectId(userId),
            clockInTime: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ clockInTime: -1 });
    }
    /**
     * 🛰️ MANAGER LIVE DESK ACCELERATOR
     */
    async findActivePortersToday(branchId) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        return await AttendanceLog_1.AttendanceLog.find({
            branch: new mongoose_1.Types.ObjectId(branchId),
            status: "ACTIVE",
            clockInTime: { $gte: startOfToday, $lte: endOfToday },
        })
            .populate("user", "fullName email contactNumber role")
            .sort({ clockInTime: 1 });
    }
    getGeofenceThreshold() {
        return this.MAX_RADIUS_METERS;
    }
}
exports.AttendanceRepository = AttendanceRepository;
