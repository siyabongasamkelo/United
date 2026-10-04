import { Request, Response, NextFunction } from "express";
import { UserService, IUserService } from "../services/UserService";

interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
  };
}

export class UserController {
  private userService: IUserService;

  constructor() {
    this.userService = new UserService();
  }

  onboardOrSync = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.userService.onboardOrSyncUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error); // 🎯 Seamlessly forwards straight to our centralized error handler middleware!
    }
  };

  getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const clerkId = req.auth?.userId;
      if (!clerkId) {
        res
          .status(401)
          .json({
            success: false,
            error: "Missing identity token parameters.",
          });
        return;
      }

      const profile = await this.userService.getUserProfile(clerkId);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  assignStore = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { clerkId, storeId, storeName } = req.body;
      const updatedUser = await this.userService.assignStoreToOperator(
        clerkId,
        storeId,
        storeName,
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Retail layout target updated.",
          data: updatedUser,
        });
    } catch (error) {
      next(error);
    }
  };

  toggleStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { clerkId, isActive } = req.body;
      const updatedUser = await this.userService.toggleUserOperationalStatus(
        clerkId,
        isActive,
      );
      res
        .status(200)
        .json({
          success: true,
          message: `Account state shifted successfully.`,
          data: updatedUser,
        });
    } catch (error) {
      next(error);
    }
  };
}
