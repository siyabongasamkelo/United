import { Router } from "express";
import { QuizController } from "./Quiz.controller";
import { validate } from "../../middlewares/validate.middleware"; // Imagine Zod middleware wrapper
import { SubmitAnswerSchema } from "./Quiz.validation";

const router = Router();
const controller = new QuizController();

router.get("/:id/blueprint", controller.getQuizBlueprint);
router.post("/submit", validate(SubmitAnswerSchema), controller.submitQuiz);

export default router;
