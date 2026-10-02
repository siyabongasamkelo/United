import { Router } from "express";
import { QuizController } from "../controllers/quiz.controller.js";
import {
  CreateSessionSchema,
  SubmitAnswerSchema,
} from "../validatons/quiz.validation.js";
import { validate } from "../../../middlewares/validate.middleware.js"; // Standard request validator middleware snippet

const router = Router();
const controller = new QuizController();

// Use the local bouncer validation layer before execution maps to endpoints
router.post(
  "/sessions",
  validate(CreateSessionSchema),
  controller.startSession,
);
router.patch(
  "/sessions/:sessionId/answer",
  validate(SubmitAnswerSchema),
  controller.saveAnswer,
);

export default router;
