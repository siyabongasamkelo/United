"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreRepository = void 0;
const Store_1 = require("../models/Store");
const Branch_1 = require("../../branch/models/Branch");
const mongoose_1 = require("mongoose");
require("../../area/models/Area");
class StoreRepository {
    /**
     * Fetches all active stores tied explicitly to a specific branch boundary
     */
    async findStoresByBranch(branchId) {
        // ✅ FORCE OBJECTID CASTING: This satisfies the indexed MongoDB lookup layer
        return await Store_1.Store.find({
            branch: new mongoose_1.Types.ObjectId(branchId),
            isActive: true,
        }).sort({ name: 1 });
    }
    /**
     * Quick utility to check if a branch exists before processing records
     */
    async findBranchById(branchId) {
        if (!mongoose_1.Types.ObjectId.isValid(branchId))
            return null;
        // ✅ FORCE OBJECTID CASTING HERE AS WELL
        return await Branch_1.Branch.findById(new mongoose_1.Types.ObjectId(branchId));
    }
    async findBranchesByArea(areaId) {
        // 1. Validate the incoming hex string format to prevent Mongoose cast errors
        if (!mongoose_1.Types.ObjectId.isValid(areaId)) {
            return [];
        }
        // 2. Query the branches collection directly using the cross-imported Branch model
        return await Branch_1.Branch.find({
            area: new mongoose_1.Types.ObjectId(areaId),
            isActive: true,
        })
            .populate("area", "name leadership.regionalManager.name") // Hydrates parent area data
            .sort({ name: 1 });
    }
}
exports.StoreRepository = StoreRepository;
