"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const AttendanceService_1 = require("../services/AttendanceService");
class AttendanceController {
    attendanceService;
    constructor() {
        this.attendanceService = new AttendanceService_1.AttendanceService();
    }
    processClockIn = async (req, res, next) => {
        try {
            const localUserId = req.user?._id;
            const result = await this.attendanceService.registerClockIn(req.body, String(localUserId));
            res.status(201).json({
                success: true,
                message: `Clock-in record locked successfully. Wave: ${result.shiftWave}. Enjoy your shift and stay safe on the floor.`,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * 🆕 NEW HTTP POST HANDLER
     * Route: POST /api/v1/attendance/clock-out
     */
    processClockOut = async (req, res, next) => {
        try {
            const localUserId = req.user?._id;
            const { branchId, latitude, longitude } = req.body;
            const result = await this.attendanceService.registerClockOut(String(localUserId), branchId, { latitude: Number(latitude), longitude: Number(longitude) });
            res.status(200).json({
                success: true,
                message: "Your shift has been successfully finalized and recorded. Travel safe.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getMyTodayHistory = async (req, res, next) => {
        try {
            const localUserId = req.user?._id;
            const logs = await this.attendanceService.fetchUserLogsForDay(String(localUserId));
            res.status(200).json({
                success: true,
                count: logs.length,
                data: logs,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AttendanceController = AttendanceController;
