// 📂 File: server/src/features/fix-report/seeds/fixReportSeeder.ts
import { FixReport } from "../models/FixReport";
import mongoose from "mongoose";

export async function runFixReportSeed(dependencies: {
  branchId: string; // 🚀 Added to tracking dependencies inputs context
  storeGameId: string;
  storeClicksId: string;
}) {
  try {
    console.log("🔧 Fix Report Seeder: Purging maintenance logs...");
    await FixReport.deleteMany({});

    console.log(
      "🌱 Injecting active defect queues directly matching mall baseline models...",
    );

    // Seed open maintenance requests to trigger live reactive calculations on the dashboard
    await FixReport.create([
      {
        trolleyId: "UTS-GAT-042",
        storeOrigin: new mongoose.Types.ObjectId(dependencies.storeGameId),
        branchId: new mongoose.Types.ObjectId(dependencies.branchId), // 🚀 Safely linked to branch model constraint
        brokenComponent: "CASTOR_WHEELS",
        damageSeverity: "HIGH",
        maintenanceStatus: "PENDING_REPAIR",
        reportedBy: new mongoose.Types.ObjectId("651f1234567890abcdef0002"),
        notes:
          "Front-right castor bearing completely seized. Pulls hard to the left under load guidelines.",
      },
      {
        trolleyId: "UTS-GAT-118",
        storeOrigin: new mongoose.Types.ObjectId(dependencies.storeClicksId),
        branchId: new mongoose.Types.ObjectId(dependencies.branchId), // 🚀 Safely linked to branch model constraint
        brokenComponent: "CHASSIS_FRAME",
        damageSeverity: "MEDIUM",
        maintenanceStatus: "UNDER_MAINTENANCE",
        reportedBy: new mongoose.Types.ObjectId("651f1234567890abcdef0002"),
        notes:
          "Lower wire basket cross-weld broken. Sent to repair bay for micro-welding adjustments.",
      },
    ]);

    console.log(
      "✅ Success: Feature-driven Fix Report ticket records created.",
    );
  } catch (error) {
    console.error("❌ Fix Report Seeder failed:", error);
    throw error;
  }
}
