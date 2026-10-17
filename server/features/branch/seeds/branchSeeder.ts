// 📂 File: server/src/features/branch/seeds/branchSeeder.ts
import { Branch as BranchModel } from "../models/Branch"; // ❶ Aliased to avoid naming collisions
import mongoose from "mongoose";

export interface IBranchSeedDependencies {
  gatewayBranchId: string;
  areaIds: string[];
}

export async function runBranchSeed(dependencies: IBranchSeedDependencies) {
  try {
    console.log("🌿 Branch Seeder: Purging operational hub maps...");
    // ❷ Using the aliased model name safely here
    await BranchModel.deleteMany({});

    console.log("🌱 Injecting realistic commercial logistics branches...");

    const area1 =
      dependencies.areaIds[0] || new mongoose.Types.ObjectId().toString();
    const area2 = dependencies.areaIds[1] || area1;
    const area3 = dependencies.areaIds[2] || area1;

    const branchesToSeed = [
      {
        _id: new mongoose.Types.ObjectId(dependencies.gatewayBranchId),
        area: new mongoose.Types.ObjectId(area1),
        name: "GATEWAY TERMINAL HUB",
        branchCode: "BR-GAT-03",
        isActive: true,
        config: {
          branchType: "OPERATIONAL" as const,
          hasRepairFacility: true,
        },
        contacts: {
          branchManager: {
            name: "Nkosana Dlamini",
            email: "n.dlamini@unitedtrolley.co.za",
            phone: "+27 11 555 9001",
          },
          opsCoordinator: {
            name: "Sarah Jenkins",
            email: "s.jenkins@unitedtrolley.co.za",
            phone: "+27 11 555 9002",
          },
        },
        logistics: {
          depotAddress: "Unit 4, Gateway Logistics Park, Old Pretoria Road",
          city: "Midrand",
        },
      },
      {
        area: new mongoose.Types.ObjectId(area2),
        name: "DURBAN PORT BAY",
        branchCode: "BR-DUR-01",
        isActive: true,
        config: {
          branchType: "OPERATIONAL" as const,
          hasRepairFacility: false,
        },
        contacts: {
          branchManager: {
            name: "Farhaan Patel",
            email: "f.patel@unitedtrolley.co.za",
            phone: "+27 31 555 1122",
          },
        },
        logistics: {
          depotAddress: "12 Sunset Crescent, Umhlanga Ridge",
          city: "Durban",
        },
      },
      {
        area: new mongoose.Types.ObjectId(area3),
        name: "CAPE METRO HEADQUARTERS",
        branchCode: "BR-CPT-09",
        isActive: true,
        config: {
          branchType: "HEADQUARTERS" as const,
          hasRepairFacility: true,
        },
        contacts: {
          branchManager: {
            name: "Elize Joubert",
            email: "e.joubert@unitedtrolley.co.za",
            phone: "+27 21 555 4433",
          },
        },
        logistics: {
          depotAddress: "8 Industrial Way, Montague Gardens",
          city: "Cape Town",
        },
      },
      {
        area: new mongoose.Types.ObjectId(area1),
        name: "RANDBURG RECOVERY YARD",
        branchCode: "BR-RND-02",
        isActive: false,
        config: {
          branchType: "STORAGE" as const,
          hasRepairFacility: false,
        },
        contacts: {
          branchManager: {
            name: "Michael Smith",
            email: "m.smith@unitedtrolley.co.za",
            phone: "+27 11 555 7788",
          },
        },
        logistics: {
          depotAddress: "99 Hans Strijdom Drive, Randburg",
          city: "Johannesburg",
        },
      },
    ];

    // ❸ Using the aliased model name safely here
    const seededBranches = await BranchModel.create(branchesToSeed);
    console.log(
      `✅ Success: ${seededBranches.length} logistics operational branches locked into cluster topology.`,
    );

    return seededBranches.map((b) => b._id.toString());
  } catch (error) {
    console.error("❌ Branch Seeder run failed:", error);
    throw error;
  }
}
