// 📂 File: server/shared/seeds/runSeeds.ts
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
// import { runOperationalSeed } from "./operationalSeeder";
// import { runQuizSeed } from "./seedQuizzes";

// 🚀 IMPORTS FROM LOCAL FEATURE REPOSITORIES (MATCHING REGIONAL BOUNDARIES)
import { runFleetAuditSeed } from "../../features/fleet-audit/seeds/fleetAuditSeeder";
import { runFixReportSeed } from "../../features/fix-report/seeds/fixReportSeeder";
import { runAreaSeed } from "../../features/area/seeds/areaSeeder";
import { runAttendanceSeed } from "../../features/attendance/seeds/attendanceSeeder";
import { runBranchSeed } from "../../features/branch/seeds/branchSeeder";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const ATLAS_CONNECTION_STRING = process.env.MONGO_URI;

// SEED IDs to maintain consistency across our cross-talk datasets
const SHARED_IDS = {
  branchGateway: "651f1234567890abcdef0002", // Shared target branch identifier
  userWorker: "651f1234567890abcdef0002", // Shared target field staff user identifier
  storeGame: "651f1234567890abcdef0001",
  storeClicks: "651f1234567890abcdef0004",
  companyUTS: "651f1234567890abcdef0003",
};

async function executeStandaloneSeed() {
  try {
    console.log("🔍 Checking environment variables...");
    if (!ATLAS_CONNECTION_STRING) {
      throw new Error(
        "Missing Operational Context: The MONGODB_URI cloud connection string could not be resolved from your .env file.",
      );
    }

    const maskedUri = ATLAS_CONNECTION_STRING.replace(/:([^:@]+)@/, ":******@");
    console.log(`🔌 Connecting process to MongoDB Atlas: ${maskedUri}`);

    await mongoose.connect(ATLAS_CONNECTION_STRING);
    console.log("🔗 Cloud database cluster socket handshaked successfully.");

    // ❶ Execute master base configuration topology setup
    // console.log("\n--- STARTING OPERATIONAL BASE SEED ---");
    // await runOperationalSeed();
    // console.log("--- OPERATIONAL BASE SEED COMPLETE ---\n");

    // ❷ 🆕 Run Feature-Driven Area Snapshot Seeds
    console.log("--- STARTING FEATURE AREA SEED ---");
    await runAreaSeed({
      companyId: SHARED_IDS.companyUTS,
    });
    console.log("--- FEATURE AREA SEED COMPLETE ---\n");

    console.log("--- STARTING FEATURE BRANCH SEED ---");
    await runBranchSeed({
      gatewayBranchId: SHARED_IDS.branchGateway,
      areaIds: activeAreaIds,
    });
    console.log("--- FEATURE BRANCH SEED COMPLETE ---\n");

    // ❷ 🆕 Run Feature-Driven Attendance Snapshot Seeds
    console.log("--- STARTING FEATURE ATTENDANCE SEED ---");
    await runAttendanceSeed({
      branchId: SHARED_IDS.branchGateway,
      userId: SHARED_IDS.userWorker,
    });
    console.log("--- FEATURE ATTENDANCE SEED COMPLETE ---\n");

    // ❷ 🆕 Run Feature-Driven Fleet Balance Snapshot Seeds
    console.log("--- STARTING FEATURE FLEET AUDIT SEED ---");
    await runFleetAuditSeed({
      branchId: SHARED_IDS.branchGateway,
      storeGameId: SHARED_IDS.storeGame,
      storeClicksId: SHARED_IDS.storeClicks,
    });
    console.log("--- FEATURE FLEET AUDIT SEED COMPLETE ---\n");

    // ❸ 🆕 Run Feature-Driven Fix Report Defect Lifecycle Seeds
    console.log("--- STARTING FEATURE FIX REPORT SEED ---");
    await runFixReportSeed({
      storeGameId: SHARED_IDS.storeGame,
      storeClicksId: SHARED_IDS.storeClicks,
    });
    console.log("--- FEATURE FIX REPORT SEED COMPLETE ---\n");

    // ❹ Execute compliance training matrix engine seeds
    // console.log("--- STARTING QUIZ MATRICES SEED ---");
    // await runQuizSeed();
    // console.log("--- QUIZ MATRICES SEED COMPLETE ---\n");
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
