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
      const localUserId = req.user?._id;
      const localBranchId = req.user?.branchId;

      const result = await this.fixReportService.processNewFaultReport(
        req.body,
        String(localUserId),
        String(localBranchId),
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

  // 🚀 MAKE SURE THIS EXACT NAME IS ADDED INSIDE THE CONTROLLER CLASS
  resolveStoreQueue = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { storeId } = req.params;
      const localUserId = req.user?._id;

      const result = await this.fixReportService.resolveStoreMaintenanceQueue(
        String(storeId),
        String(localUserId),
      );

      res.status(200).json({
        success: true,
        message: `Successfully transitioned ${result.modifiedCount} defective asset records to RESOLVED status context.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
