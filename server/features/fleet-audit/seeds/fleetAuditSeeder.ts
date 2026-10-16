// 📂 File: server/src/features/fleet-audits/seeds/fleetAuditSeeder.ts
import { FleetAudit } from "../models/FleetAudit";
import mongoose from "mongoose";

export async function runFleetAuditSeed(dependencies: {
  branchId: string;
  storeGameId: string;
  storeClicksId: string;
}) {
  try {
    console.log("📊 Fleet Audit Seeder: Purging existing snapshot records...");
    await FleetAudit.deleteMany({});

    console.log(
      "🌱 Injecting fresh database macro balances for Gateway Terminal...",
    );

    // 1. Seed a Macro Overnight Audit snapshot to drive the overall numbers
    await FleetAudit.create({
      auditDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago (Last night)
      branch: new mongoose.Types.ObjectId(dependencies.branchId),
      store: new mongoose.Types.ObjectId(dependencies.storeGameId),
      company: new mongoose.Types.ObjectId("651f1234567890abcdef0003"), // Matches operational seeder UTS ID
      author: new mongoose.Types.ObjectId("651f1234567890abcdef0002"), // Admin user placeholder
      metrics: {
        total: 300,
        damaged: 18, // Seeded base value
        dirty: 45,
        operational: 237, // Handled dynamically, but set for absolute model completeness
      },
      notes:
        "Macro closing shift fleet audit balance check logged successfully.",
    });

    // 2. Seed Mid-Day Sweeps across stores to populate our dynamic storefront list widget
    await FleetAudit.create([
      {
        auditDate: new Date(),
        branch: new mongoose.Types.ObjectId(dependencies.branchId),
        store: new mongoose.Types.ObjectId(dependencies.storeGameId),
        company: new mongoose.Types.ObjectId("651f1234567890abcdef0003"),
        author: new mongoose.Types.ObjectId("651f1234567890abcdef0002"),
        metrics: { total: 120, damaged: 5, dirty: 15, operational: 100 },
      },
      {
        auditDate: new Date(),
        branch: new mongoose.Types.ObjectId(dependencies.branchId),
        store: new mongoose.Types.ObjectId(dependencies.storeClicksId),
        company: new mongoose.Types.ObjectId("651f1234567890abcdef0003"),
        author: new mongoose.Types.ObjectId("651f1234567890abcdef0002"),
        metrics: { total: 80, damaged: 2, dirty: 10, operational: 68 },
      },
    ]);

    console.log(
      "✅ Success: Feature-driven Fleet Audit tables seeded flawlessly.",
    );
  } catch (error) {
    console.error("❌ Fleet Audit Seeder failed:", error);
    throw error;
  }
}
