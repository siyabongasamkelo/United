// 📂 File: server/src/features/certification/seeds/certificationSeeder.ts
import { Certification } from "../models/Certification";
import mongoose from "mongoose";
import * as crypto from "crypto";

export interface ICertificationSeedDependencies {
  userId: string; // The central Porter/User ID who earned the credentials
}

export async function runCertificationSeed(
  dependencies: ICertificationSeedDependencies,
) {
  try {
    console.log("🎓 Certification Seeder: Purging compliance credentials...");
    await Certification.deleteMany({});

    console.log("🌱 Injecting verified training certification records...");

    const userObjId = new mongoose.Types.ObjectId(dependencies.userId);

    // Hardcoded mock references to match structural quiz architecture elements safely
    const mockTopics = [
      new mongoose.Types.ObjectId("651f1234567890abcdef0101"), // OHS Floor Safety Topic
      new mongoose.Types.ObjectId("651f1234567890abcdef0102"), // Trolley Steering Best Practices
      new mongoose.Types.ObjectId("651f1234567890abcdef0103"), // Geofence & Boundary Management
    ];

    const mockAttempts = [
      new mongoose.Types.ObjectId("651f1234567890abcdef0201"), // Quiz Attempt 1 Reference
      new mongoose.Types.ObjectId("651f1234567890abcdef0202"), // Quiz Attempt 2 Reference
      new mongoose.Types.ObjectId("651f1234567890abcdef0203"), // Quiz Attempt 3 Reference
    ];

    const certificationsToSeed = [
      {
        user: userObjId,
        quizTopic: mockTopics[0],
        quizAttempt: mockAttempts[0],
        dateEarned: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Earned 30 days ago
        verificationHash: crypto
          .createHash("sha256")
          .update(`CERT-${dependencies.userId}-TOPIC1`)
          .digest("hex"),
      },
      {
        user: userObjId,
        quizTopic: mockTopics[1],
        quizAttempt: mockAttempts[1],
        dateEarned: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Earned 15 days ago
        verificationHash: crypto
          .createHash("sha256")
          .update(`CERT-${dependencies.userId}-TOPIC2`)
          .digest("hex"),
      },
      {
        user: userObjId,
        quizTopic: mockTopics[2],
        quizAttempt: mockAttempts[2],
        dateEarned: new Date(), // Earned just now
        verificationHash: crypto
          .createHash("sha256")
          .update(`CERT-${dependencies.userId}-TOPIC3`)
          .digest("hex"),
      },
    ];

    const seededCertifications =
      await Certification.create(certificationsToSeed);
    console.log(
      `✅ Success: ${seededCertifications.length} compliance certifications signed and stamped successfully.`,
    );
  } catch (error) {
    console.error("❌ Certification Seeder run failed:", error);
    throw error;
  }
}
