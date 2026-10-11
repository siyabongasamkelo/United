import { QuizTopic } from "../../features/safety-quizzes/models/QuizTopic"; // Verify this points to your model path

const mockQuizData = [
  {
    title: "⚡ DEMO ONLY: Quick Certificate Test",
    description:
      "A fast, single-parameter assessment built to test the real-time digital certification rendering pipeline instantly during supervisor walk-throughs.",
    hazardLevel: "LOW",
    passingScorePercentage: 100,
    isActive: true,
    questions: [
      {
        questionId: "DEMO_01",
        questionText:
          "Before operating any heavy machinery on the warehouse floor, what is the first requirement?",
        options: [
          "A) Start the machine immediately to save operational time constraints.",
          "B) Put on full required PPE and ensure your immediate workspace is clear of hazards.",
          "C) Check your phone for any corporate updates or messages.",
          "D) Wait until half-shift to report compliance checks.",
        ],
        correctAnswer: "B",
        explanation:
          "Immediate safety boundaries dictate donning mandatory personal protective equipment before interfacing with live equipment stacks.",
      },
    ],
  },
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
    passingScorePercentage: 100,
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
  {
    title: "Fire Safety & Hazardous Material Spills",
    description:
      "Emergency evacuation protocol patterns and safe containment handling requirements for accidental chemical cleaner or warehouse fuel fluid ruptures.",
    hazardLevel: "HIGH",
    passingScorePercentage: 80,
    isActive: true,
    questions: [
      {
        questionId: "FIRE_01",
        questionText:
          "When dealing with a localized Class B fire (flammable liquids/greases), which fire extinguisher classification agent is mandatory?",
        options: [
          "A) Standard pressurized water extinguisher tanks.",
          "B) CO2 Carbon Dioxide or Dry Powder chemical suppression arrays.",
          "C) Throwing a damp cardboard inventory divider over the active flames.",
          "D) Spraying high-velocity compressed air to scatter the vapor fields.",
        ],
        correctAnswer: "B",
        explanation:
          "Class B chemical or fluid fires can flare up violently if hit with water. Pressurized CO2 or dry powder chemicals starve the chemical reaction of oxygen safely.",
      },
    ],
  },
];

// 🚀 EXPORT THIS EXPLICITLY INSTEAD OF CONNECTING INTERNALLY
export async function runQuizSeed(): Promise<void> {
  console.log("⏳ Purging active QuizTopic records from collection...");
  await QuizTopic.deleteMany({});
  console.log("🧹 QuizTopic collection cleared successfully.");

  console.log("🌱 Injecting Quiz expanded matrix data records...");
  const seededDocs = await QuizTopic.insertMany(mockQuizData);
  console.log(
    `✅ Success! Seeded ${seededDocs.length} Compliance Training Matrices.`,
  );

  seededDocs.forEach((doc) => {
    console.log(`   📌 Module: "${doc.title}" -> ID: ${doc._id}`);
  });
}
