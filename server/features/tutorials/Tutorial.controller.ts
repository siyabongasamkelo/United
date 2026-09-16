import { Request, Response } from "express";
import { TutorialService } from "./Tutorial.service";

export class TutorialController {
  private tutorialService = new TutorialService();

  getAllTutorials = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.tutorialService.listAvailableTutorials();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getTutorialById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.tutorialService.getTutorialDetails(id as string);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}
