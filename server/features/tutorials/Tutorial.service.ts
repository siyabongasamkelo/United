import { TutorialRepository } from "./Tutorial.repository";

export class TutorialService {
  private tutorialRepo = new TutorialRepository();

  async listAvailableTutorials() {
    return await this.tutorialRepo.getAllActive();
  }

  async getTutorialDetails(id: string) {
    const tutorial = await this.tutorialRepo.getById(id);
    if (!tutorial)
      throw new Error("Requested training demonstration not found");
    return tutorial;
  }
}
