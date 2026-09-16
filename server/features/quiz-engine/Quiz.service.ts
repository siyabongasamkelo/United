import { QuizRepository } from "./Quiz.repository";

export class QuizService {
  private quizRepo = new QuizRepository();

  async fetchBlueprint(testId: string) {
    const blueprint = await this.quizRepo.getTestBlueprint(testId);
    if (!blueprint) throw new Error("Test assessment not found");
    return blueprint;
  }

  async evaluateTest(
    testId: string,
    userAnswers: { questionId: string; selectedPayload: any }[],
  ) {
    const fullTest = await this.quizRepo.getTestWithAnswers(testId);
    if (!fullTest) throw new Error("Test configuration missing");

    let totalPointsEarned = 0;
    let maxPossiblePoints = 0;

    // Server-side scoring engine looping through dynamic sections
    fullTest.sections.forEach((section) => {
      section.questions.forEach((question) => {
        maxPossiblePoints += question.points;
        const matchingAnswer = userAnswers.find(
          (a) => a.questionId === question._id.toString(),
        );

        if (
          matchingAnswer &&
          JSON.stringify(matchingAnswer.selectedPayload) ===
            JSON.stringify(question.correctAnswer)
        ) {
          totalPointsEarned += question.points;
        }
      });
    });

    const finalScorePercentage = (totalPointsEarned / maxPossiblePoints) * 100;
    return {
      totalPointsEarned,
      maxPossiblePoints,
      finalScorePercentage,
      isPassed: finalScorePercentage >= 80,
    };
  }
}
