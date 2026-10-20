// 📂 File: features/store-visit/services/StoreVisitService.ts
import { StoreVisitRepository } from "../repositories/StoreVisitRepository";
import { Store } from "../../store/models/Store"; // 🚀 Connected your updated Store model context
import { IStoreVisit, TVerificationStatus } from "../models/StoreVisit";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";
import { z } from "zod";

export const storeScanPayloadSchema = z.object({
  storeId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB Store identifier format"),
  latitude: z.number().min(-90).max(90, "Latitude parameter out of bounds"),
  longitude: z.number().min(-180).max(180, "Longitude parameter out of bounds"),
});

export type StoreScanPayloadInput = z.infer<typeof storeScanPayloadSchema>;

export class StoreVisitService {
  private visitRepo: StoreVisitRepository;
  private GEOFENCE_THRESHOLD_METERS = 40; // 🛰️ 40m safe margin tracking allowance for roof interference

  constructor() {
    this.visitRepo = new StoreVisitRepository();
  }

  /**
   * ❶ Core Business Engine: Processes raw QR scans dynamically, runs the Geofence Math, and logs results.
   */
  async recordStoreScan(
    payload: unknown,
    localUser: any,
  ): Promise<IStoreVisit> {
    const startTime = performance.now();

    // 1. Parse and validate the incoming device coordinates and scanned data
    const validatedInput: StoreScanPayloadInput =
      storeScanPayloadSchema.parse(payload);
    const { storeId, latitude, longitude } = validatedInput;

    // 2. Fetch the target store directory configuration dynamically from MongoDB
    const targetStore = await Store.findById(storeId);
    if (!targetStore) {
      throw createAppError(
        "Store sweep verification failed. Scanned store entity profile not found.",
        404,
      );
    }

    // 3. Compute spherical mathematical distance delta using the Haversine Formula against true store vectors
    const distanceMeters = this.calculateHaversineDistance(
      latitude,
      longitude,
      targetStore.coordinates.latitude,
      targetStore.coordinates.longitude,
    );

    // 4. Run verification status analysis rules
    let finalStatus: TVerificationStatus = "VERIFIED";
    if (distanceMeters > this.GEOFENCE_THRESHOLD_METERS) {
      finalStatus = "LOCATION_MISMATCH";
    }

    // 5. Structure payload fields completely matching the schema blueprint architecture
    const visitRecordData: Partial<IStoreVisit> = {
      porter: localUser._id,
      store: targetStore._id as any,
      branch: localUser.branchId,
      scannedAt: new Date(),
      deviceCoordinates: { latitude, longitude },
      storeCoordinatesSnapshot: {
        latitude: targetStore.coordinates.latitude,
        longitude: targetStore.coordinates.longitude,
      },
      distanceDelta: Math.round(distanceMeters * 10) / 10,
      verificationStatus: finalStatus,
    };

    // 6. Record and commit transaction safely inside MongoDB cluster indices
    const savedVisit = await this.visitRepo.create(visitRecordData);

    // 7. Fire performance telemetry log trace streams directly to infrastructure pipelines
    telemetry.info({
      event: "STORE_QR_SCAN_PROCESSED",
      visitId: savedVisit._id,
      porterId: localUser._id,
      storeId: savedVisit.store,
      status: finalStatus,
      distanceDeltaMeters: savedVisit.distanceDelta,
      durationMs: Math.round(performance.now() - startTime),
    });

    return savedVisit;
  }

  /**
   * ❷ Fetch a porter's detailed track history for a specific calendar shift day.
   */
  async getPorterDailyTimeline(
    porterId: string,
    dateStr: string,
  ): Promise<IStoreVisit[]> {
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) {
      throw createAppError(
        "Timeline calculation failed. Expected a valid date string specification.",
        400,
      );
    }
    return await this.visitRepo.findByPorterAndDate(porterId, targetDate);
  }

  /**
   * ❸ Extract branch fraud bypass logs to secure operational perimeters.
   */
  async getBranchFraudAudits(branchId: string): Promise<IStoreVisit[]> {
    return await this.visitRepo.findFraudAlertsByBranch(branchId);
  }

  /**
   * ❹ Compile high-level porter data aggregations to use in corporate tender proposals.
   */
  async getBranchSummaryPerformance(
    branchId: string,
    startStr: string,
    endStr: string,
  ) {
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw createAppError(
        "Invalid range timeline gate parameters received.",
        400,
      );
    }

    return await this.visitRepo.getPorterSummaryMetrics(branchId, start, end);
  }

  /**
   * 🧮 INTERNAL MATHEMATICAL CALCULATOR: Haversine Formula Implementation
   */
  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const EARTH_RADIUS_METERS = 6371000;

    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_METERS * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
