"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const StoreService_1 = require("../services/StoreService");
class StoreController {
    storeService;
    constructor() {
        this.storeService = new StoreService_1.StoreService();
    }
    getBranchStores = async (req, res, next) => {
        try {
            // ✅ Pull exactly what TypeScript knows exists on your IUser interface
            const branchId = req.user?.branchId;
            if (!branchId) {
                res.status(400).json({
                    success: false,
                    message: "Auth Token verification failed. Missing active branch assignment context.",
                });
                return;
            }
            const stores = await this.storeService.getStoresForBranch(String(branchId));
            res.status(200).json({
                success: true,
                count: stores.length,
                data: stores,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.StoreController = StoreController;
