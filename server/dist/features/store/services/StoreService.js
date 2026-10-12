"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const StoreRepository_1 = require("../repositories/StoreRepository");
const errorMiddleware_1 = require("../../../shared/middleware/errorMiddleware");
class StoreService {
    storeRepo;
    constructor() {
        this.storeRepo = new StoreRepository_1.StoreRepository();
    }
    async getStoresForBranch(branchId) {
        // 1. Structural Parameter Gatekeeper
        if (!branchId || branchId === "undefined") {
            throw (0, errorMiddleware_1.createAppError)("Branch tracking parameter reference is mandatory.", 400);
        }
        // ✅ 2. DIRECT EXECUTION: Cut out the extra database hop. Just fetch the stores!
        return await this.storeRepo.findStoresByBranch(branchId);
    }
}
exports.StoreService = StoreService;
