import { FleetAuditRepository } from "../repositories/FleetAuditRepository";
import {
  fleetAuditPayloadValidationSchema,
  FleetAuditPayloadInput,
} from "../validations/fleetAuditValidation";
import { IFleetAudit } from "../models/FleetAudit";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";

export interface IFleetAuditService {
  submitFleetAudit(payload: unknown, authorId: string): Promise<IFleetAudit>;
  getAuditById(id: string): Promise<IFleetAudit>;
  getDailyAudits(dateStr: string, storeId?: string): Promise<IFleetAudit[]>;
  getWeeklyAudits(
    startDateStr: string,
    storeId?: string,
  ): Promise<IFleetAudit[]>;
  getMonthlyAudits(
    yearStr: string,
    monthStr: string,
    storeId?: string,
  ): Promise<IFleetAudit[]>;
  getAuditAnalytics(
    startDateStr: string,
    endDateStr: string,
    storeId?: string,
  ): Promise<any>;
}

export class FleetAuditService implements IFleetAuditService {
  private auditRepo: FleetAuditRepository;

  constructor() {
    this.auditRepo = new FleetAuditRepository();
  }

  /**
   * Validates and submits a new Fleet Audit record, binding the authenticated author securely.
   */
  async submitFleetAudit(
    payload: unknown,
    authorId: string,
  ): Promise<IFleetAudit> {
    const startTime = performance.now();

    // Parse input using our root schema architecture layout
    const validatedInput: FleetAuditPayloadInput =
      fleetAuditPayloadValidationSchema.parse(payload);

    // Merge validated dataset along with the system-provided author metadata
    const auditData = {
      ...validatedInput,
      auditDate: new Date(validatedInput.auditDate),
      author: authorId,
    };

    const savedAudit = await this.auditRepo.create(auditData as any);

    telemetry.info({
      event: "FLEET_AUDIT_SUBMIT_SUCCESS",
      auditId: savedAudit._id,
      storeId: savedAudit.store,
      branchId: savedAudit.branch,
      authorId,
      totalTrolleys: savedAudit.metrics.total,
      durationMs: Math.round(performance.now() - startTime),
    });

    return savedAudit;
  }

  /**
   * Retrieves an audit profile by its unique ID. Throws 404 factory error if missing.
   */
  async getAuditById(id: string): Promise<IFleetAudit> {
    const audit = await this.auditRepo.findById(id);

    if (!audit) {
      throw createAppError(
        `Fleet audit retrieval failed. Document trace missing for ID: ${id}`,
        404,
      );
    }

    return audit;
  }

  /**
   * Fetches data records matching a specific single-day timestamp window.
   */
  async getDailyAudits(
    dateStr: string,
    storeId?: string,
  ): Promise<IFleetAudit[]> {
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) {
      throw createAppError(
        "Invalid query parameter format. Expected a valid date string.",
        400,
      );
    }

    return await this.auditRepo.findByDate(targetDate, storeId);
  }

  /**
   * Fetches records spanning exactly 7 days forward from a starting boundary timestamp.
   */
  async getWeeklyAudits(
    startDateStr: string,
    storeId?: string,
  ): Promise<IFleetAudit[]> {
    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) {
      throw createAppError(
        "Invalid query parameter format. Expected a valid start date string.",
        400,
      );
    }

    return await this.auditRepo.findByWeek(startDate, storeId);
  }

  /**
   * Fetches records organized across a complete calendar monthly span.
   */
  async getMonthlyAudits(
    yearStr: string,
    monthStr: string,
    storeId?: string,
  ): Promise<IFleetAudit[]> {
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // Note: 1-indexed value received from route layer (1-12)

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      throw createAppError(
        "Invalid calendar constraints. Provide a valid numeric year and month (1-12).",
        400,
      );
    }

    // Convert to standard 0-indexed JS Month format (0-11) for internal calculations
    return await this.auditRepo.findByMonth(year, month - 1, storeId);
  }

  /**
   * Aggregates historical metrics to supply analytical pipelines.
   */
  async getAuditAnalytics(
    startDateStr: string,
    endDateStr: string,
    storeId?: string,
  ): Promise<any> {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw createAppError(
        "A comprehensive data aggregation requires matching valid date parameters.",
        400,
      );
    }

    if (start > end) {
      throw createAppError(
        "Analytics calculation failed. Lower timeline gate cannot pass the higher gate constraint.",
        422,
      );
    }

    const performanceRecords = await this.auditRepo.getHistoricalMetrics(
      start,
      end,
      storeId,
    );

    // Provide placeholder dashboard fallbacks if the collection is empty for the current range
    if (!performanceRecords || performanceRecords.length === 0) {
      return {
        avgTotalTrolleys: 0,
        avgDamagedTrolleys: 0,
        avgDirtyTrolleys: 0,
        avgOperationalTrolleys: 0,
        totalAuditsPerformed: 0,
      };
    }

    return performanceRecords[0];
  }
}
