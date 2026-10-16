import { Store, IStore } from "../models/Store";
import { Branch, IBranch } from "../../branch/models/Branch";
import { Types } from "mongoose";
import "../../area/models/Area";

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

  async findBranchesByArea(areaId: string): Promise<IBranch[]> {
    // 1. Validate the incoming hex string format to prevent Mongoose cast errors
    if (!Types.ObjectId.isValid(areaId)) {
      return [];
    }

    // 2. Query the branches collection directly using the cross-imported Branch model
    return await Branch.find({
      area: new Types.ObjectId(areaId),
      isActive: true,
    })
      .populate("area", "name leadership.regionalManager.name") // Hydrates parent area data
      .sort({ name: 1 });
  }
}
