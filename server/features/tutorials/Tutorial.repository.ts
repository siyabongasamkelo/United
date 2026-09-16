import { TutorialModel, ITutorial } from "./Tutorial.model";

export class TutorialRepository {
  async getAllActive(): Promise<ITutorial[]> {
    return await TutorialModel.find({ isActive: true }).lean();
  }

  async getById(id: string): Promise<ITutorial | null> {
    return await TutorialModel.findById(id).lean();
  }

  // Explicitly declare the type parameter to match the exact schema constraints
  async getByCategory(
    category: "ROPE_TYING" | "PASSAGE_NAVIGATION" | "EQUIPMENT_SAFETY",
  ): Promise<ITutorial[]> {
    return await TutorialModel.find({ category, isActive: true }).lean();
  }
}
