import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../shared/middleware/authMiddleware";
import { FixReportService } from "../services/FixReportService";

export class FixReportController {
  private fixReportService: FixReportService;

  constructor() {
    this.fixReportService = new FixReportService();
  }

  logFaultReport = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Safely pull the reporting employee ID straight out of the hydrated session profile pipeline context
      const localUserId = req.user?._id;
      const result = await this.fixReportService.processNewFaultReport(
        req.body,
        String(localUserId),
      );

      res.status(201).json({
        success: true,
        message:
          "Defective asset safely registered inside operational maintenance queue logs.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getActiveQueue = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const activeQueueList = await this.fixReportService.retrieveActiveQueue();
      res.status(200).json({
        success: true,
        count: activeQueueList.length,
        data: activeQueueList,
      });
    } catch (error) {
      next(error);
    }
  };
}
