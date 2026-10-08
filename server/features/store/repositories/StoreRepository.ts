import { Store, IStore } from "../models/Store";
import { Branch } from "../../branch/models/Branch";

export class StoreRepository {
  /**
   * Fetches all active stores tied explicitly to a specific branch boundary
   */
  async findStoresByBranch(branchId: string): Promise<IStore[]> {
    return await Store.find({
      branch: branchId,
      isActive: true,
    }).sort({ name: 1 }); // Alphabetical sort keeps dropdown entries consistent [3.2]
  }

  /**
   * Quick utility to check if a branch exists before processing records
   */
  async findBranchById(branchId: string) {
    return await Branch.findById(branchId);
  }
}
