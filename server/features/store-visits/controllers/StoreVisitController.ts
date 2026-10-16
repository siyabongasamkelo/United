import { Request, Response, NextFunction } from "express";
import { StoreVisitService } from "../services/StoreVisitService";

export class StoreVisitController {
  private visitService: StoreVisitService;

  constructor() {
    this.visitService = new StoreVisitService();
  }

  /**
   * HTTP POST: Receives a QR code text payload alongside live device GPS telemetry coordinates.
   * Route: POST /api/v1/store-visits/scan
   */
  processStoreScan = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // 🛰️ Safely pull the local MongoDB User document pre-attached by your hydrateLocalUser middleware!
      const activeUser = (req as any).user;

      const result = await this.visitService.recordStoreScan(
        req.body,
        activeUser,
      );

      // Determine clean scannable feedback details based on the geofence calculation outcome
      const isSuccess = result.verificationStatus === "VERIFIED";
      const statusCode = isSuccess ? 201 : 200; // Still log the attempt even if they are out of bounds

      res.status(statusCode).json({
        success: isSuccess,
        message: isSuccess
          ? "Store sweep entry successfully verified and recorded."
          : `Geofence validation warning: You were flagged ${result.distanceDelta} meters outside the store bay limits.`,
        data: result,
      });
    } catch (error) {
      next(error); // Route straight into your errorMiddleware engine
    }
  };

  /**
   * HTTP GET: Fetches the chronological sweep history of a single porter for a target shift date window.
   * Route: GET /api/v1/store-visits/timeline/:porterId?date=2026-10-14
   */
  getPorterTimeline = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // const { porterId } = req.params;
      const porterId = req.params.porterId as string;
      const dateStr = req.query.date as string;

      const timeline = await this.visitService.getPorterDailyTimeline(
        porterId,
        dateStr,
      );

      res.status(200).json({
        success: true,
        count: timeline.length,
        data: timeline,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * HTTP GET: Isolates all anomalous and unauthorized layout scans across territory boundaries.
   * Route: GET /api/v1/store-visits/fraud-alerts
   */
  getBranchFraudAlerts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Pull the branch association straight from the supervisor's active administrative record node
      const supervisorBranchId = (req as any).user?.branchId;

      const alerts =
        await this.visitService.getBranchFraudAudits(supervisorBranchId);

      res.status(200).json({
        success: true,
        count: alerts.length,
        data: alerts,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * HTTP GET: Compiles high-performance rolling totals for corporate client reviews.
   * Route: GET /api/v1/store-visits/analytics/summary?startDate=...&endDate=...
   */
  getBranchPerformanceSummary = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const supervisorBranchId = (req as any).user?.branchId;
      const startDateStr = req.query.startDate as string;
      const endDateStr = req.query.endDate as string;

      const analyticalData =
        await this.visitService.getBranchSummaryPerformance(
          supervisorBranchId,
          startDateStr,
          endDateStr,
        );

      res.status(200).json({
        success: true,
        data: analyticalData,
      });
    } catch (error) {
      next(error);
    }
  };
}
