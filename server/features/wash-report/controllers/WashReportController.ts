import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../shared/middleware/authMiddleware";
import { WashReportService } from "../services/WashReportService";

export class WashReportController {
  private washReportService: WashReportService;

  constructor() {
    this.washReportService = new WashReportService();
  }

  logWashReport = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // 🚀 Safely extract context parameters straight out of the hydrated token pipelines
      const localUserId = req.user?._id;
      const localBranchId = req.user?.branchId;

      const result = await this.washReportService.processNewWashReport(
        req.body,
        String(localUserId),
        String(localBranchId),
      );

      res.status(201).json({
        success: true,
        message:
          "Dirty asset successfully logged inside operational wash bay queue.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Add this method inside your WashReportController class
  resolveStoreQueue = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Extract storeId from request parameters (e.g., /resolve-store/:storeId)
      // const { storeId } = req.params;
      const localUserId = req.user?._id;
      const storeId = String(req.params.storeId);
      const result = await this.washReportService.resolveStoreWashQueue(
        storeId,
        String(localUserId),
      );

      res.status(200).json({
        success: true,
        message: `Successfully transitioned ${result.modifiedCount} trolley tickets to CLEANED status context.`,
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
      const activeQueueList =
        await this.washReportService.retrieveActiveQueue();
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
