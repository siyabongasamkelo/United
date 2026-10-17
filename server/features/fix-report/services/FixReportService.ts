import { FixReportRepository } from "../repositories/FixReportRepository";
import {
  createFixReportPayloadSchema,
  CreateFixReportInput,
} from "../validations/fixReportValidation";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";

export class FixReportService {
  private fixReportRepo: FixReportRepository;

  constructor() {
    this.fixReportRepo = new FixReportRepository();
  }

  async processNewFaultReport(
    payload: unknown,
    managerUserId: string,
    managerBranchId: string,
  ) {
    const startTime = performance.now();

    // 1. Validate incoming data body properties via Zod schema checks
    const validatedInput: CreateFixReportInput =
      createFixReportPayloadSchema.parse(payload);

    // 2. Transmit and map data properties into the storage structure layout definitions
    const createdLog = await this.fixReportRepo.saveReport({
      trolleyId: validatedInput.trolleyId,
      storeOrigin: validatedInput.storeOriginId as any,
      branchId: managerBranchId as any, // 🚀 Embedded here safely
      brokenComponent: validatedInput.brokenComponent,
      damageSeverity: validatedInput.damageSeverity,
      reportedBy: managerUserId as any,
      notes: validatedInput.notes,
      evidenceImageUrl: validatedInput.evidenceImageUrl,
    });

    // 3. Issue structural winston execution logs out to tracking containers
    telemetry.info({
      event: "ASSET_FAULT_REGISTERED",
      reportId: createdLog._id,
      trolleyId: createdLog.trolleyId,
      branchId: managerBranchId, // 🚀 Added to tracking telemetry logs
      component: createdLog.brokenComponent,
      reportedBy: managerUserId,
      durationMs: Math.round(performance.now() - startTime),
    });

    return createdLog;
  }

  // Add this method inside your FixReportService class
  async resolveStoreMaintenanceQueue(storeId: string, managerUserId: string) {
    const startTime = performance.now();

    const result =
      await this.fixReportRepo.bulkResolveStoreMaintenanceQueue(storeId);

    // Issue structured winston execution logs out to tracking containers
    telemetry.info({
      event: "STORE_MAINTENANCE_QUEUE_RESOLVED",
      storeOriginId: storeId,
      resolvedCount: result.modifiedCount,
      actionedBy: managerUserId,
      durationMs: Math.round(performance.now() - startTime),
    });

    return result;
  }

  async retrieveActiveQueue() {
    return await this.fixReportRepo.findActiveMaintenanceQueue();
  }

  async transitionAssetStatus(reportId: string, status: string) {
    const tracking = await this.fixReportRepo.updateReportStatus(
      reportId,
      status,
    );
    if (!tracking) {
      throw createAppError(
        "The specified asset maintenance record could not be found.",
        404,
      );
    }
    return tracking;
  }
}
