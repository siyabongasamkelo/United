// 📂 File: server/src/features/quiz/seeds/quizSeeder.ts
import { QuizTopic } from "../models/QuizTopic";
import { QuizSession } from "../models/QuizSession";
import { QuizAttempt } from "../models/QuizAttempt";
import mongoose from "mongoose";

export interface IQuizSeedDependencies {
  userId: string;
  storeId: string;
  branchId: string;
}

export async function runSafetyQuizSeed(dependencies: IQuizSeedDependencies) {
  try {
    console.log(
      "🧠 Quiz Seeder: Purging questionnaire modules, active sessions, and scorecard attempts...",
    );
    await QuizTopic.deleteMany({});
    await QuizSession.deleteMany({});
    await QuizAttempt.deleteMany({});

    console.log("🌱 Injecting high-compliance OHS Quiz Topics...");

    const userObjId = new mongoose.Types.ObjectId(dependencies.userId);
    const storeObjId = new mongoose.Types.ObjectId(dependencies.storeId);
    const branchObjId = new mongoose.Types.ObjectId(dependencies.branchId);

    // ❶ Define standard shared Quiz Topics
    const topicsToSeed = [
      {
        _id: new mongoose.Types.ObjectId("651f1234567890abcdef0101"),
        title: "Occupational Floor Safety & PPE Compliance",
        description:
          "Mandatory safety parameters covering required steel-toe boots, high-visibility reflector vests, and basic terminal floor hazard awareness.",
        hazardLevel: "HIGH" as const,
        passingScorePercentage: 100, // Strict regulatory requirements
        questions: [
          {
            questionId: "Q-PPE-01",
            questionText:
              "Which item of Personal Protective Equipment (PPE) is legally mandatory before stepping onto the store terminal floor?",
            options: [
              "A) Regular sneakers",
              "B) Steel-toe safety boots",
              "C) Open sandals",
              "D) Rubber boots",
            ],
            correctAnswer: "B",
            explanation:
              "Steel-toe safety boots protect field operators against accidental wheel crush risks and heavy cargo drops on the floor.",
          },
          {
            questionId: "Q-PPE-02",
            questionText:
              "What is the primary operational purpose of wearing a high-visibility reflector vest during shift hours?",
            options: [
              "A) To keep warm",
              "B) To comply with local store dress code",
              "C) To ensure absolute visibility to heavy delivery vehicles and customers",
              "D) To identify supervisors",
            ],
            correctAnswer: "C",
            explanation:
              "Reflector vests prevent pedestrian collisions by highlighting porters inside dark delivery bays or high-traffic parking zones.",
          },
        ],
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId("651f1234567890abcdef0102"),
        title: "Trolley Line Steering Dynamics & Controls",
        description:
          "Best practices for controlling and maneuvering strings of carts on sloped surfaces without causing damage or injuries.",
        hazardLevel: "MEDIUM" as const,
        passingScorePercentage: 80,
        questions: [
          {
            questionId: "Q-STR-01",
            questionText:
              "What is the maximum number of standard collection trolleys a single porter is legally permitted to guide using a steering rope?",
            options: [
              "A) 5 Trolleys",
              "B) 10 Trolleys",
              "C) 15 Trolleys",
              "D) 20 Trolleys",
            ],
            correctAnswer: "A",
            explanation:
              "The standard safety limit is 5 trolleys per string to maintain total steering control and prevent momentum runaways on inclines.",
          },
          {
            questionId: "Q-STR-02",
            questionText:
              "When moving a line of trolleys down a steep parking bay ramp, how should the steering rope be utilized?",
            options: [
              "A) Dropped completely on the side",
              "B) Taut at the front to act as a pivot and braking anchor point",
              "C) Tied to the rear trolley",
              "D) Ignored entirely",
            ],
            correctAnswer: "B",
            explanation:
              "Keeping the steering rope taut allows you to guide the front wheel path while controlling the descent vector safely.",
          },
        ],
        isActive: true,
      },
    ];

    await QuizTopic.create(topicsToSeed);
    console.log("✅ Quiz Topics locked down cleanly into collection storage.");

    // ❷ Seed an active "IN_PROGRESS" session (Shows data on live operator tracking screens)
    console.log("🌱 Injecting live in-progress training sessions...");
    await QuizSession.create({
      user: userObjId,
      quizTopic: topicsToSeed[1]._id, // Steering Dynamics Quiz
      store: storeObjId,
      branch: branchObjId,
      status: "IN_PROGRESS",
      answers: [
        {
          questionId: "Q-STR-01",
          selectedAnswer: "A",
          updatedAt: new Date(),
        },
      ],
      startedAt: new Date(Date.now() - 15 * 60 * 1000), // Started 15 mins ago
      lastActiveAt: new Date(),
    });

    // ❸ Seed historical finished attempts (Populates analytics and charts)
    console.log("🌱 Injecting verified historical scorecard breakdowns...");
    await QuizAttempt.create([
      {
        user: userObjId,
        store: storeObjId,
        branch: branchObjId,
        quizTopic: topicsToSeed[0]._id, // Floor Safety
        attemptDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        score: 2,
        totalQuestions: 2,
        percentageScore: 100,
        hasPassed: true,
        digitalSignature:
          "data:image/png;base64,SiphoModiseSignatureVerificationString",
        breakdown: [
          {
            questionId: "Q-PPE-01",
            questionText:
              "Which item of Personal Protective Equipment (PPE) is legally mandatory before stepping onto the store terminal floor?",
            selectedAnswer: "B",
            correctAnswer: "B",
            isCorrect: true,
            explanation:
              "Steel-toe safety boots protect field operators against accidental wheel crush risks and heavy cargo drops on the floor.",
          },
          {
            questionId: "Q-PPE-02",
            questionText:
              "What is the primary operational purpose of wearing a high-visibility reflector vest during shift hours?",
            selectedAnswer: "C",
            correctAnswer: "C",
            isCorrect: true,
            explanation:
              "Reflector vests prevent pedestrian collisions by highlighting porters inside dark delivery bays or high-traffic parking zones.",
          },
        ],
      },
    ]);

    console.log(
      "✅ Success: All 3 safety quiz models successfully populated with relational mock data.",
    );
  } catch (error) {
    console.error("❌ Safety Quiz Seeder run failed:", error);
    throw error;
  }
}
