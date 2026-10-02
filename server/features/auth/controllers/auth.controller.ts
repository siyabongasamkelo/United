import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async registerStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      await authService.registerStudent(email, password);
      res
        .status(201)
        .json({
          success: true,
          message: "Registration successful. Please verify your email address.",
        });
    } catch (error) {
      next(error);
    }
  }

  async adminProvision(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, role, staffNumber, nationalId } = req.body;
      await authService.adminProvisionUser(
        email,
        role,
        staffNumber,
        nationalId,
      );
      res
        .status(201)
        .json({
          success: true,
          message: "User account provisioned and invitation email sent.",
        });
    } catch (error) {
      next(error);
    }
  }

  async setupPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { token, password } = req.body;
      await authService.finalizeAccountSetup(token, password);
      res
        .status(200)
        .json({
          success: true,
          message: "Password configured successfully. You may now log in.",
        });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, password } = req.body;
      const result = await authService.login(identifier, password);
      res
        .status(200)
        .json({
          success: true,
          message: "Authentication successful.",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  }
}
