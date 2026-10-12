"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRepository = void 0;
const AttendanceLog_1 = require("../models/AttendanceLog");
const mongoose_1 = require("mongoose");
class AttendanceRepository {
    // Center Coordinate Constants for Gateway Theatre of Shopping (Umhlanga)
    GATEWAY_LAT = -29.7259;
    GATEWAY_LNG = 31.0664;
    MAX_RADIUS_METERS = 200; // Strict boundary constraint line
    /**
     * Applies the Haversine formula to compute distance over the Earth's spherical surface
     */
    calculateDistanceToGateway(userLat, userLng) {
        const EarthRadiusKm = 6371;
        const dLat = ((userLat - this.GATEWAY_LAT) * Math.PI) / 180;
        const dLng = ((userLng - this.GATEWAY_LNG) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((this.GATEWAY_LAT * Math.PI) / 180) *
                Math.cos((userLat * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceMeters = EarthRadiusKm * c * 1000;
        return distanceMeters;
    }
    async createLog(logData) {
        const log = new AttendanceLog_1.AttendanceLog(logData);
        return await log.save();
    }
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
    getGeofenceThreshold() {
        return this.MAX_RADIUS_METERS;
    }
}
exports.AttendanceRepository = AttendanceRepository;
