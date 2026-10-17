import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../shared/middleware/authMiddleware";
import { ManagersConsoleService } from "../services/ManagersConsoleService";

export class ManagersConsoleController {
  private managersConsoleService: ManagersConsoleService;

  constructor() {
    this.managersConsoleService = new ManagersConsoleService();
  }

  getDashboardSummary = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
    
      const branchId = req.params.branchId; 

      if (!branchId) {
        res.status(400).json({
          success: false,
          message:
            "Auth verification constraint failed. Missing active branch mapping context.",
        });
        return;
      }

      const summaryData =
        await this.managersConsoleService.getBranchPerformanceSummary(
          String(branchId),
        );

      res.status(200).json({
        success: true,
        message:
          "Executive live matrix summary successfully balanced and aggregated.",
        data: summaryData,
      });
    } catch (error) {
      next(error);
    }
  };
}
