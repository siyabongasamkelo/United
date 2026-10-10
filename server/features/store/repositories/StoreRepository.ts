import { Store, IStore } from "../models/Store";
import { Branch } from "../../branch/models/Branch";
import { Types } from "mongoose"; // ✅ Ensure Types is imported at the top [2, 3]

export class StoreRepository {
  /**
   * Fetches all active stores tied explicitly to a specific branch boundary
   */
  async findStoresByBranch(branchId: string): Promise<IStore[]> {
    // ✅ FORCE OBJECTID CASTING: This satisfies the indexed MongoDB lookup layer
    return await Store.find({
      branch: new Types.ObjectId(branchId),
      isActive: true,
    }).sort({ name: 1 });
  }

  /**
   * Quick utility to check if a branch exists before processing records
   */
  async findBranchById(branchId: string) {
    if (!Types.ObjectId.isValid(branchId)) return null;

    // ✅ FORCE OBJECTID CASTING HERE AS WELL
    return await Branch.findById(new Types.ObjectId(branchId));
  }
}
