// 📂 File: server/src/features/wash-report/seeds/washReportSeeder.ts
import { WashReport } from "../models/WashReport";
import mongoose from "mongoose";

export async function runWashReportSeed(dependencies: {
  branchId: string;
  storeGameId: string;
  storeClicksId: string;
}) {
  try {
    console.log("🧼 Wash Report Seeder: Purging cleaning logs...");
    await WashReport.deleteMany({});

    console.log(
      "🌱 Injecting active washing queues directly matching mall baseline models...",
    );

    // Seed open maintenance wash requests to trigger live reactive calculations on the dashboard
    await WashReport.create([
      {
        trolleyId: "UTS-GAT-088",
        storeOrigin: new mongoose.Types.ObjectId(dependencies.storeGameId),
        branchId: new mongoose.Types.ObjectId(dependencies.branchId), // 🚀 Linked safely to branch context
        contaminationType: "SPILLAGE",
        washPriority: "HIGH",
        washStatus: "PENDING_WASH",
        reportedBy: new mongoose.Types.ObjectId("651f1234567890abcdef0002"),
        notes:
          "Severe soda syrup spillage throughout interior wire frame. Extremely sticky and attracting dirt.",
      },
      {
        trolleyId: "UTS-GAT-145",
        storeOrigin: new mongoose.Types.ObjectId(dependencies.storeClicksId),
        branchId: new mongoose.Types.ObjectId(dependencies.branchId), // 🚀 Linked safely to branch context
        contaminationType: "MUD_DIRT",
        washPriority: "MEDIUM",
        washStatus: "IN_WASH_BAY",
        reportedBy: new mongoose.Types.ObjectId("651f1234567890abcdef0002"),
        notes:
          "Heavy mud accumulation on lower trays from outdoor rainy shift deployment lanes. Currently being jet washed.",
      },
    ]);

    console.log(
      "✅ Success: Feature-driven Wash Report ticket records created.",
    );
  } catch (error) {
    console.error("❌ Wash Report Seeder failed:", error);
    throw error;
  }
}
