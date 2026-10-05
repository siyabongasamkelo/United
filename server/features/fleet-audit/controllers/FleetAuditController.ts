import { Request, Response, NextFunction } from "express";
import { FleetAuditService } from "../services/FleetAuditService";

export class FleetAuditController {
  private auditService: FleetAuditService;

  constructor() {
    this.auditService = new FleetAuditService();
  }

  /**
   * HTTP POST: Submits a fresh fleet audit record
   * Route: POST /api/v1/fleet-audits
   */
  submitAudit = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Extract the logged-in User ID attached by your authMiddleware
      const authorId = (req as any).user?.id || (req as any).auth?.userId;

      const result = await this.auditService.submitFleetAudit(
        req.body,
        authorId,
      );

      res.status(201).json({
        success: true,
        message: "Fleet audit submitted and recorded successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * HTTP GET: Retrieves a specific fleet audit by its MongoDB document ID
   * Route: GET /api/v1/fleet-audits/:id
   */
  getAuditById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // const dateStr = String(req.query.date)
      const idStr = String(req.params.id);
      //   const { id } = req.params;
      //   const result = await this.auditService.getAuditById(id);

      const result = await this.auditService.getAuditById(idStr);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * HTTP GET: Fetches tracking records matching a single daily date window
   * Route: GET /api/v1/fleet-audits/daily?date=2026-10-04&storeId=...
   */
  getDailyAudits = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dateStr = req.query.date as string;
      const storeId = req.query.storeId as string;

      const result = await this.auditService.getDailyAudits(dateStr, storeId);

      res.status(200).json({
        success: true,
        count: result.length,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * HTTP GET: Fetches tracking records matching a 7-day span forward from a date
   * Route: GET /api/v1/fleet-audits/weekly?startDate=2026-10-01&storeId=...
   */
  getWeeklyAudits = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const startDateStr = req.query.startDate as string;
      const storeId = req.query.storeId as string;

      const result = await this.auditService.getWeeklyAudits(
        startDateStr,
        storeId,
      );

      res.status(200).json({
        success: true,
        count: result.length,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * HTTP GET: Fetches tracking records organized by a specific calendar month
   * Route: GET /api/v1/fleet-audits/monthly?year=2026&month=10&storeId=...
   */
  getMonthlyAudits = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const yearStr = req.query.year as string;
      const monthStr = req.query.month as string;
      const storeId = req.query.storeId as string;

      const result = await this.auditService.getMonthlyAudits(
        yearStr,
        monthStr,
        storeId,
      );

      res.status(200).json({
        success: true,
        count: result.length,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * HTTP GET: Aggregates historical metrics to supply analytical pipelines and charts
   * Route: GET /api/v1/fleet-audits/analytics?startDate=2026-01-01&endDate=2026-10-04&storeId=...
   */
  getAuditAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const startDateStr = req.query.startDate as string;
      const endDateStr = req.query.endDate as string;
      const storeId = req.query.storeId as string;

      const result = await this.auditService.getAuditAnalytics(
        startDateStr,
        endDateStr,
        storeId,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
