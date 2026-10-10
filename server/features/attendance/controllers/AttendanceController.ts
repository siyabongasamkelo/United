import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../shared/middleware/authMiddleware";
import { AttendanceService } from "../services/AttendanceService";

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  processClockIn = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const localUserId = req.user?._id;
      const result = await this.attendanceService.registerClockIn(
        req.body,
        String(localUserId),
      );

      res.status(201).json({
        success: true,
        message: `Clock-in record locked successfully. Wave: ${result.shiftWave}. Enjoy your shift and stay safe on the floor.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyTodayHistory = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const localUserId = req.user?._id;
      const logs = await this.attendanceService.fetchUserLogsForDay(
        String(localUserId),
      );

      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  };
}
