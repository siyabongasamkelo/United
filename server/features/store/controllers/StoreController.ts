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
      // Pull the branch layout context dynamically from the supervisor's hydrated token profile [4, 8]
      const branchId = req.user?.branchId;

      const stores = await this.storeService.getStoresForBranch(
        String(branchId),
      );

      res.status(200).json({
        success: true,
        count: stores.length,
        data: stores,
      });
    } catch (error) {
      next(error); // Route gracefully straight into the global error handler middleware [4]
    }
  };
}
