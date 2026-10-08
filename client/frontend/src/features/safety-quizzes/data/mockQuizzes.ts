import { IQuizTopicResponse } from "../services/safetyQuizService";

export const mockSafetyQuizzes: IQuizTopicResponse[] = [
  {
    _id: "651f1234567890abcdef0901",
    title: "Manual Material Handling & Lifting",
    description:
      "Standard protocols for porters handling heavily packed inventory, deep transit crates, or moving bulk roll-tainers across store floors safely.",
    hazardLevel: "MEDIUM",
    passingScorePercentage: 80,
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
      },
    ],
  },
  {
    _id: "651f1234567890abcdef0902",
    title: "Electrical Machinery & Emergency Protocols",
    description:
      "Operational guidelines for working safely near automated high-pressure cardboard baling presses, electrical shrink wrappers, or loose charging docks.",
    hazardLevel: "HIGH",
    passingScorePercentage: 100, // Strict legal zero-tolerance requirement
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
      },
    ],
  },
];
