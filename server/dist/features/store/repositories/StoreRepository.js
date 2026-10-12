"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreRepository = void 0;
const Store_1 = require("../models/Store");
const Branch_1 = require("../../branch/models/Branch");
const mongoose_1 = require("mongoose"); // ✅ Ensure Types is imported at the top [2, 3]
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
}
exports.StoreRepository = StoreRepository;
