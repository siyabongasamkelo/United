// 📂 File: server/shared/seeds/runSeeds.ts
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
import { runOperationalSeed } from "./operationalSeeder";
import { runQuizSeed } from "./seedQuizzes";

// 🚀 IMPORTS FROM LOCAL FEATURE REPOSITORIES
import { runAreaSeed } from "../../features/area/seeds/areaSeeder";
import { runBranchSeed } from "../../features/branch/seeds/branchSeeder";
import { runStoreSeed } from "../../features/store/seeds/storeSeeder";
import { runStoreVisitSeed } from "../../features/store-visits/seeds/storeVisitSeeder";
import { runFleetAuditSeed } from "../../features/fleet-audit/seeds/fleetAuditSeeder";
import { runFixReportSeed } from "../../features/fix-report/seeds/fixReportSeeder";
import { runUserSeed } from "../../features/users/seeds/userSeeder";
import { runAttendanceSeed } from "../../features/attendance/seeds/attendanceSeeder";
import { runCertificationSeed } from "../../features/certificate/seeds/certificationSeeder";
import { runCompanySeed } from "../../features/company/seeds/companySeeder";
import { runSafetyQuizSeed } from "../../features/safety-quizzes/seeds/quizSeeder";
// import { runAreaSeed } from "../../features/area/seeds/areaSeeder";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const ATLAS_CONNECTION_STRING = process.env.MONGO_URI;

// Central static identifiers to maintain integrity across our collection cross-talk datasets
const SHARED_IDS = {
  areaGauteng: "651f1234567890abcdef0005",
  branchGateway: "651f1234567890abcdef0002",
  userWorker: "651f1234567890abcdef0002", // Central shared worker user record link
  storeGame: "651f1234567890abcdef0001",
  storeClicks: "651f1234567890abcdef0004",
  companyUTS: "651f1234567890abcdef0003",
};

async function executeStandaloneSeed() {
  // ❶ Declare your tracking array here at the top level of the function scope!
  let activeAreaIds: string[] = [];

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

    // ❷ Execute master base configuration topology setup
    console.log("\n--- STARTING OPERATIONAL BASE SEED ---");
    await runOperationalSeed();
    console.log("--- OPERATIONAL BASE SEED COMPLETE ---\n");

    // ❷ Execute company seed setup
    console.log("--- STARTING FOUNDATIONAL COMPANY SEED ---");
    await runCompanySeed({
      sharedCompanyId: SHARED_IDS.companyUTS,
    });
    console.log("--- FOUNDATIONAL COMPANY SEED COMPLETE ---\n");

    // ❸ Run structural Geographical Area seeds first & capture the return array values
    console.log("--- STARTING FEATURE AREA SEED ---");
    activeAreaIds = await runAreaSeed({
      companyId: SHARED_IDS.companyUTS,
      sharedAreaId: SHARED_IDS.areaGauteng,
    });
    console.log("--- FEATURE AREA SEED COMPLETE ---\n");

    // ❹ Run Logistics Branch seeds utilizing the captured geographical area arrays
    console.log("--- STARTING FEATURE BRANCH SEED ---");
    await runBranchSeed({
      gatewayBranchId: SHARED_IDS.branchGateway,
      areaIds: activeAreaIds,
    });
    console.log("--- FEATURE BRANCH SEED COMPLETE ---\n");

    // ❶ RUN THE STORE SEED SECTOR IMMEDIATELY AFTER THE LOGISTICS BRANCH BOUNDARY RUNS
    console.log("--- STARTING FEATURE STORE SEED ---");
    await runStoreSeed({
      branchId: SHARED_IDS.branchGateway,
      storeGameId: SHARED_IDS.storeGame,
      storeClicksId: SHARED_IDS.storeClicks,
    });
    console.log("--- FEATURE STORE SEED COMPLETE ---\n");

    // ❶ EXECUTE THE USER SEED IMMEDIATELY AFTER STORES TO RESOLVE TRANSACTION ARRAYS
    console.log("--- STARTING FEATURE USER SEED ---");
    await runUserSeed({
      sharedUserId: SHARED_IDS.userWorker,
      branchId: SHARED_IDS.branchGateway,
      storeGameId: SHARED_IDS.storeGame,
      storeClicksId: SHARED_IDS.storeClicks,
    });
    console.log("--- FEATURE USER SEED COMPLETE ---\n");

    // ❶ RUN THE STORE Visit SEED FOR TRACKING PERFOMANCE OF TROLLEY PORTER
    console.log("--- STARTING FEATURE STORE VISIT SEED ---");
    await runStoreVisitSeed({
      userId: SHARED_IDS.userWorker,
      branchId: SHARED_IDS.branchGateway,
      storeGameId: SHARED_IDS.storeGame,
      storeClicksId: SHARED_IDS.storeClicks,
    });
    console.log("--- FEATURE STORE VISIT SEED COMPLETE ---\n");

    // ❹ Run Saftey Quiz seeds
    console.log("--- STARTING FEATURE SAFETY QUIZ SEED ---");
    await runSafetyQuizSeed({
      userId: SHARED_IDS.userWorker,
      storeId: SHARED_IDS.storeGame,
      branchId: SHARED_IDS.branchGateway,
    });
    console.log("--- FEATURE SAFETY QUIZ SEED COMPLETE ---\n");

    // ❹ Run Certificate seeds utilizing the captured quize results
    console.log("--- STARTING FEATURE CERTIFICATION SEED ---");
    await runCertificationSeed({
      userId: SHARED_IDS.userWorker,
    });
    console.log("--- FEATURE CERTIFICATION SEED COMPLETE ---\n");

    // ❺ Run Feature-Driven Fleet Balance Snapshot Seeds
    console.log("--- STARTING FEATURE FLEET AUDIT SEED ---");
    await runFleetAuditSeed({
      branchId: SHARED_IDS.branchGateway,
      storeGameId: SHARED_IDS.storeGame,
      storeClicksId: SHARED_IDS.storeClicks,
    });
    console.log("--- FEATURE FLEET AUDIT SEED COMPLETE ---\n");

    // ❻ Run Feature-Driven Fix Report Defect Lifecycle Seeds
    console.log("--- STARTING FEATURE FIX REPORT SEED ---");
    await runFixReportSeed({
      storeGameId: SHARED_IDS.storeGame,
      storeClicksId: SHARED_IDS.storeClicks,
    });
    console.log("--- FEATURE FIX REPORT SEED COMPLETE ---\n");

    // ❼ Run Feature-Driven Shift Attendance Logs
    console.log("--- STARTING FEATURE ATTENDANCE SEED ---");
    await runAttendanceSeed({
      branchId: SHARED_IDS.branchGateway,
      userId: SHARED_IDS.userWorker,
    });
    console.log("--- FEATURE ATTENDANCE SEED COMPLETE ---\n");

    // ❽ Execute compliance training matrix engine seeds
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
