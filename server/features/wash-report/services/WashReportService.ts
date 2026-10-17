import { WashReportRepository } from "../repositories/WashReportRepository";
import {
  createWashReportPayloadSchema,
  CreateWashReportInput,
} from "../validations/washReportValidation";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";

export class WashReportService {
  private washReportRepo: WashReportRepository;

  constructor() {
    this.washReportRepo = new WashReportRepository();
  }

  async processNewWashReport(
    payload: unknown,
    managerUserId: string,
    managerBranchId: string,
  ) {
    const startTime = performance.now();

    // 1. Validate payload data properties via Zod schema checks
    const validatedInput: CreateWashReportInput =
      createWashReportPayloadSchema.parse(payload);

    // 2. Map structural layout arguments into storage layers
    const createdLog = await this.washReportRepo.saveReport({
      trolleyId: validatedInput.trolleyId,
      storeOrigin: validatedInput.storeOriginId as any,
      branchId: managerBranchId as any, // 🚀 Embedded securely down the stream pipeline
      contaminationType: validatedInput.contaminationType,
      washPriority: validatedInput.washPriority,
      reportedBy: managerUserId as any,
      notes: validatedInput.notes,
      evidenceImageUrl: validatedInput.evidenceImageUrl,
    });

    // 3. Issue structural execution tracking performance telemetry
    telemetry.info({
      event: "ASSET_WASH_REGISTERED",
      reportId: createdLog._id,
      trolleyId: createdLog.trolleyId,
      branchId: managerBranchId,
      type: createdLog.contaminationType,
      reportedBy: managerUserId,
      durationMs: Math.round(performance.now() - startTime),
    });

    return createdLog;
  }

  // Add this method inside your WashReportService class
  async resolveStoreWashQueue(storeId: string, managerUserId: string) {
    const startTime = performance.now();

    const result = await this.washReportRepo.bulkResolveStoreWashQueue(storeId);

    // Issue clear winston execution logs out to tracking containers
    telemetry.info({
      event: "STORE_WASH_QUEUE_RESOLVED",
      storeOriginId: storeId,
      resolvedCount: result.modifiedCount,
      actionedBy: managerUserId,
      durationMs: Math.round(performance.now() - startTime),
    });

    return result;
  }

  async retrieveActiveQueue() {
    return await this.washReportRepo.findActiveWashQueue();
  }

  async transitionWashStatus(reportId: string, status: string) {
    const tracking = await this.washReportRepo.updateWashStatus(
      reportId,
      status,
    );
    if (!tracking) {
      throw createAppError(
        "The specified asset washing ticket record could not be found.",
        404,
      );
    }
    return tracking;
  }
}
