import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js"; // Universal validation runtime wrapper middleware
import { authorizeRoles } from "../../../middlewares/authMiddleware.js"; // The authorization guard we built previously
import {
  StudentRegisterSchema,
  AdminCreateUserSchema,
  CompleteSetupSchema,
  LoginSchema,
} from "../validatons/auth.validation.js";

const router = Router();
const controller = new AuthController();

router.post(
  "/register",
  validate(StudentRegisterSchema),
  controller.registerStudent,
);
router.post("/login", validate(LoginSchema), controller.login);
router.post(
  "/setup-password",
  validate(CompleteSetupSchema),
  controller.setupPassword,
);

// 🔒 Protected Administrative Control Path Gateway
router.post(
  "/provision",
  authorizeRoles("admin"),
  validate(AdminCreateUserSchema),
  controller.adminProvision,
);

export default router;
