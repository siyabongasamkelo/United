import { Router } from "express";
import { TutorialController } from "./Tutorial.controller";

const router = Router();
const controller = new TutorialController();

router.get("/", controller.getAllTutorials);
router.get("/:id", controller.getTutorialById);

export default router;
