import { StoreRepository } from "../repositories/StoreRepository";
import { createAppError } from "../../../shared/middleware/errorMiddleware";

export class StoreService {
  private storeRepo: StoreRepository;

  constructor() {
    this.storeRepo = new StoreRepository();
  }

  async getStoresForBranch(branchId: string) {
    if (!branchId) {
      throw createAppError(
        "Branch tracking parameter reference is mandatory.",
        400,
      );
    }

    // Guard Check: Confirm the branch exists in our topology
    const branchExists = await this.storeRepo.findBranchById(branchId);
    if (!branchExists) {
      throw createAppError(
        "The specified operational branch boundary does not exist.",
        404,
      );
    }

    return await this.storeRepo.findStoresByBranch(branchId);
  }
}
