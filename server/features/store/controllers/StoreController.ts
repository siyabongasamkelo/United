import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../shared/middleware/authMiddleware";
import { StoreService } from "../services/StoreService";

export class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  getBranchStores = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // ✅ Pull exactly what TypeScript knows exists on your IUser interface
      const branchId = req.user?.branchId;

      if (!branchId) {
        res.status(400).json({
          success: false,
          message:
            "Auth Token verification failed. Missing active branch assignment context.",
        });
        return;
      }

      const stores = await this.storeService.getStoresForBranch(
        String(branchId),
      );

      res.status(200).json({
        success: true,
        count: stores.length,
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  };
}
