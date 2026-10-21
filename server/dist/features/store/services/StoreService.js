"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
// 📂 File: united-trolley-backend/features/store/services/StoreService.ts
const StoreRepository_1 = require("../repositories/StoreRepository");
const errorMiddleware_1 = require("../../../shared/middleware/errorMiddleware");
const logger_1 = require("../../../shared/telemetry/logger"); // 🚀 IMPORTED TELEMETRY CLIENT
class StoreService {
    storeRepo;
    constructor() {
        this.storeRepo = new StoreRepository_1.StoreRepository();
    }
    /**
     * Fetches all active stores belonging to a specific branch boundary
     */
    async getStoresForBranch(branchId) {
        const startTime = performance.now(); // ⏱️ Start timing the execution grid
        if (!branchId || branchId === "undefined") {
            throw (0, errorMiddleware_1.createAppError)("Branch tracking parameter reference is mandatory.", 400);
        }
        const stores = await this.storeRepo.findStoresByBranch(branchId);
        // 🚀 TELEMETRY INTERCEPTOR: Track success metrics & lookup performance
        logger_1.telemetry.info({
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
    async getBranchesForArea(areaId) {
        const startTime = performance.now(); // ⏱️ Start timing the execution grid
        if (!areaId || areaId === "undefined") {
            throw (0, errorMiddleware_1.createAppError)("Area tracking parameter reference is mandatory.", 400);
        }
        const branches = await this.storeRepo.findBranchesByArea(areaId);
        // 🚀 TELEMETRY INTERCEPTOR: Track area lookup counts & timing
        logger_1.telemetry.info({
            event: "FETCH_AREA_BRANCHES_SUCCESS",
            areaId,
            branchesCount: branches.length,
            durationMs: Math.round(performance.now() - startTime),
        });
        return branches;
    }
}
exports.StoreService = StoreService;
