import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
import { runOperationalSeed } from "./operationalSeeder";
import { runQuizSeed } from "./seedQuizzes";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const ATLAS_CONNECTION_STRING = process.env.MONGO_URI;

async function executeStandaloneSeed() {
  try {
    console.log("🔍 Checking environment variables...");
    if (!ATLAS_CONNECTION_STRING) {
      console.log("❌ ERROR: MONGODB_URI is undefined inside process.env!");
      console.log(`📂 Current Process Directory is: ${process.cwd()}`);
      throw new Error(
        "Missing Operational Context: The MONGODB_URI cloud connection string could not be resolved from your .env file.",
      );
    }

    const maskedUri = ATLAS_CONNECTION_STRING.replace(/:([^:@]+)@/, ":******@");
    console.log(`🔌 Connecting process to MongoDB Atlas: ${maskedUri}`);

    await mongoose.connect(ATLAS_CONNECTION_STRING);
    console.log("🔗 Cloud database cluster socket handshaked successfully.");

    // 🚀 2. Execute corporate topologies first
    console.log("\n--- STARTING OPERATIONAL SEED ---");
    await runOperationalSeed();
    console.log("--- OPERATIONAL SEED COMPLETE ---\n");

    // 🚀 3. Execute your training matrices seed second inside the same open pipeline
    console.log("--- STARTING QUIZ MATRICES SEED ---");
    await runQuizSeed();
    console.log("--- QUIZ MATRICES SEED COMPLETE ---\n");
  } catch (error) {
    console.error(
      "❌ Critical runtime seed process failure encountered:",
      error,
    );
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log(
      "🔌 Standalone process disconnected from cloud cluster. Exit code 0.",
    );
    process.exit(0);
  }
}

executeStandaloneSeed();
