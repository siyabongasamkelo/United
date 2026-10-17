// 📂 File: server/src/features/company/seeds/companySeeder.ts
import { Company } from "../models/Company";
import mongoose from "mongoose";

export interface ICompanySeedDependencies {
  sharedCompanyId: string; // The central static ID used across your application ecosystem
}

export async function runCompanySeed(dependencies: ICompanySeedDependencies) {
  try {
    console.log("🏢 Company Seeder: Purging multi-fleet retail entities...");
    await Company.deleteMany({});

    console.log("🌱 Injecting core fleet management company providers...");

    const companiesToSeed = [
      // 1. Primary Company matching your system-wide SHARED_IDS structure
      {
        _id: new mongoose.Types.ObjectId(dependencies.sharedCompanyId),
        name: "United Trolley Services",
        registrationNumber: "2018/432109/07",
        isActive: true,
      },
      // 2. Secondary Coastal Fleet Competitor
      {
        name: "Super Cart Logistics",
        registrationNumber: "2021/876543/07",
        isActive: true,
      },
      // 3. National Retail Fleet Contractors
      {
        name: "Apex Trolley Solutions",
        registrationNumber: "2015/112233/07",
        isActive: true,
      },
      // 4. Inactive Historical Sub-Contractor
      {
        name: "Metro Basket Recovery",
        registrationNumber: "2012/009988/07",
        isActive: false, // Seeded as inactive to verify administrative UI isolation
      },
    ];

    const seededCompanies = await Company.create(companiesToSeed);
    console.log(
      `✅ Success: ${seededCompanies.length} fleet corporate entities initialized smoothly.`,
    );
  } catch (error) {
    console.error("❌ Company Seeder run failed:", error);
    throw error;
  }
}
