import mongoose from "mongoose";
import { QuizTopic } from "../features/safety-quizzes/models/QuizTopic"; // Keep your model path as is
import dotenv from "dotenv";
import path from "path"; // ❶ Import the core Node.js path module

// 🚫 REPLACE THE OLD LINE:
// dotenv.config();

// ❷ FORCE AN ABSOLUTE PATH LOOKUP TO THE ROOT DIRECTORY:
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Keep the connection logic exactly the same underneath, but add a console tracker:
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(
    "🚫 Systems Mismatch: Could not resolve your .env variables. Verify path mappings.",
  );
  process.exit(1);
}

const mockQuizData = [
  {
    title: "Manual Material Handling & Lifting",
    description:
      "Standard protocols for porters handling heavily packed inventory, deep transit crates, or moving bulk roll-tainers across store floors safely.",
    hazardLevel: "MEDIUM",
    passingScorePercentage: 80,
    isActive: true,
    questions: [
      {
        questionId: "MMH_01",
        questionText:
          "When picking up a heavy transit box from the floor container, which mechanical stance keeps your spine safe under OHS guidelines?",
        options: [
          "A) Bend your waist cleanly with straight legs to harness rapid upper arm torque.",
          "B) Keep your feet close together, drop your head forward, and pull with upper shoulders.",
          "C) Squat down keeping your heels planted, back straight, and lift evenly using your leg muscles.",
          "D) Twisting the lower core quickly while picking up the item to increase loading speeds.",
        ],
        correctAnswer: "C",
        explanation:
          "OHS rules dictate lifting with your legs, keeping your back vertical to completely bypass lumbar structural strain.",
      },
      {
        questionId: "MMH_02",
        questionText:
          "What is the maximum recommended weight ceiling a single operator should push or maneuver on a standard stock flatbed trolley single-handed?",
        options: [
          "A) Weight rules do not apply as long as the operator wears leather safety footwear protectors.",
          "B) Up to 55kg; any load profile scaling higher requires dual-porter mechanical assistance teams.",
          "C) 150kg; porters are expected to push heavy industrial iron loads solo through standard shifts.",
          "D) There is no legal metric limit as long as visibility over the front profile is completely open.",
        ],
        correctAnswer: "B",
        explanation:
          "Legal porter boundaries recommend scaling dual-assistance teams if weight limits breach 55kg profiles.",
      },
    ],
  },
  {
    title: "Electrical Machinery & Emergency Protocols",
    description:
      "Operational guidelines for working safely near automated high-pressure cardboard baling presses, electrical shrink wrappers, or loose charging docks.",
    hazardLevel: "HIGH",
    passingScorePercentage: 100, // Strict legal zero-tolerance requirement
    isActive: true,
    questions: [
      {
        questionId: "ELE_01",
        questionText:
          "You spot a loose wire leaking fluid or sparking on an active packaging machine. What is the immediate required workflow sequence?",
        options: [
          "A) Throw clean water on the cable to mitigate active fires before locating standard supervisors.",
          "B) Do not touch the system. Hit the Emergency Stop button, isolate the area, and sound the supervisor alarm immediately.",
          "C) Run the device at lower speed settings to complete the immediate active shift log requirements.",
          "D) Tape the wire down using standard protective plastic wrap insulation and continue running counts.",
        ],
        correctAnswer: "B",
        explanation:
          "High-risk matrices dictate hitting E-Stop instantly. Never attempt temporary hacks on live high-voltage wiring.",
      },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log("⏳ Connecting to local MongoDB cluster...");
    await mongoose.connect(MONGO_URI);
    console.log("🚀 Connection verified. Purging active QuizTopic records...");

    // ❶ Clean slate execution to avoid duplicate key validation blocks
    await QuizTopic.deleteMany({});
    console.log("🧹 Collection cleared successfully.");

    // ❷ Inject raw arrays through your Mongoose schema pipelines
    const seededDocs = await QuizTopic.insertMany(mockQuizData);
    console.log(
      `✅ Success! Seeded ${seededDocs.length} Compliance Training Matrices into the database.`,
    );

    // Verify mapped indices for you to use on frontend tests
    seededDocs.forEach((doc) => {
      console.log(`📌 Module: "${doc.title}" -> ID: ${doc._id}`);
    });
  } catch (error) {
    console.error("🚫 Seeding Transaction Pipeline Failed:", error);
  } finally {
    console.log("🔒 Disconnecting from cluster logs.");
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
