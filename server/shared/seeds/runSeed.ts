import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
import { runOperationalSeed } from "./operationalSeeder";

// 1. Force absolute resolution from the Root Folder where your package.json sits
dotenv.config({ path: path.join(process.cwd(), ".env") });

// 2. Fetch the Atlas cluster connection string directly from memory
const ATLAS_CONNECTION_STRING = process.env.MONGO_URI;

async function executeStandaloneSeed() {
  try {
    // 💡 DIAGNOSTIC SAFETY CHECK: Print out what your environment is seeing
    console.log("🔍 Checking environment variables...");
    if (!ATLAS_CONNECTION_STRING) {
      console.log("❌ ERROR: MONGODB_URI is undefined inside process.env!");
      console.log(`📂 Current Process Directory is: ${process.cwd()}`);
      throw new Error(
        "Missing Operational Context: The MONGODB_URI cloud connection string could not be resolved from your .env file.",
      );
    }

    // Secure masking for terminal logs
    const maskedUri = ATLAS_CONNECTION_STRING.replace(/:([^:@]+)@/, ":******@");
    console.log(`🔌 Connecting process to MongoDB Atlas: ${maskedUri}`);

    // Connect explicitly using your real cloud cluster string
    await mongoose.connect(ATLAS_CONNECTION_STRING);
    console.log("🔗 Cloud database cluster socket handshaked successfully.");

    // 3. Execute your corporate topology seeder
    await runOperationalSeed();
  } catch (error) {
    console.error(
      "❌ Critical runtime seed process failure encountered:",
      error,
    );
    process.exit(1);
  } finally {
    // 4. Disconnect cleanly so the CLI task finishes completely
    await mongoose.disconnect();
    console.log(
      "🔌 Standalone process disconnected from cloud cluster. Exit code 0.",
    );
    process.exit(0);
  }
}

executeStandaloneSeed();
