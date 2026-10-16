// 📂 File: united-trolley-backend/features/store/services/StoreService.ts
import { StoreRepository } from "../repositories/StoreRepository";
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger"; // 🚀 IMPORTED TELEMETRY CLIENT

export class StoreService {
  private storeRepo: StoreRepository;

  constructor() {
    this.storeRepo = new StoreRepository();
  }

  /**
   * Fetches all active stores belonging to a specific branch boundary
   */
  async getStoresForBranch(branchId: string) {
    const startTime = performance.now(); // ⏱️ Start timing the execution grid

    if (!branchId || branchId === "undefined") {
      throw createAppError(
        "Branch tracking parameter reference is mandatory.",
        400,
      );
    }

    const stores = await this.storeRepo.findStoresByBranch(branchId);

    // 🚀 TELEMETRY INTERCEPTOR: Track success metrics & lookup performance
    telemetry.info({
      event: "FETCH_BRANCH_STORES_SUCCESS",
      branchId,
      storesCount: stores.length,
      durationMs: Math.round(performance.now() - startTime),
    });

    return stores;
  }

  /**
   * 🆕 NEW OPERATIONAL GATEWAY FOR AREA MANAGERS
   * Fetches all branches tied explicitly to a specific Area/Region ID
   */
  async getBranchesForArea(areaId: string) {
    const startTime = performance.now(); // ⏱️ Start timing the execution grid

    if (!areaId || areaId === "undefined") {
      throw createAppError(
        "Area tracking parameter reference is mandatory.",
        400,
      );
    }

    const branches = await this.storeRepo.findBranchesByArea(areaId);

    // 🚀 TELEMETRY INTERCEPTOR: Track area lookup counts & timing
    telemetry.info({
      event: "FETCH_AREA_BRANCHES_SUCCESS",
      areaId,
      branchesCount: branches.length,
      durationMs: Math.round(performance.now() - startTime),
    });

    return branches;
  }
}
