import { StoreRepository } from "../repositories/StoreRepository";
import { createAppError } from "../../../shared/middleware/errorMiddleware";

export class StoreService {
  private storeRepo: StoreRepository;

  constructor() {
    this.storeRepo = new StoreRepository();
  }

  async getStoresForBranch(branchId: string) {
    // 1. Structural Parameter Gatekeeper
    if (!branchId || branchId === "undefined") {
      throw createAppError(
        "Branch tracking parameter reference is mandatory.",
        400,
      );
    }

    // ✅ 2. DIRECT EXECUTION: Cut out the extra database hop. Just fetch the stores!
    return await this.storeRepo.findStoresByBranch(branchId);
  }
}
