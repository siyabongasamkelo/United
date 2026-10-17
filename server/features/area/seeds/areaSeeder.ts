// 📂 File: server/src/features/area/seeds/areaSeeder.ts
import { Area } from "../models/Area";
import mongoose from "mongoose";

export interface IAreaSeedDependencies {
  companyId: string;
  sharedAreaId: string;
}

export async function runAreaSeed(dependencies: IAreaSeedDependencies) {
  try {
    console.log("🏢 Area Seeder: Purging existing geographical territories...");
    await Area.deleteMany({});

    console.log("🌱 Injecting 7 pristine regional administrative areas...");

    const companyObjectId = new mongoose.Types.ObjectId(dependencies.companyId);

    const areasToSeed = [
      {
        _id: new mongoose.Types.ObjectId(dependencies.sharedAreaId),
        company: companyObjectId,
        name: "Gauteng Central",
        areaCode: "REG-GP-01",
        isActive: true,
        leadership: {
          regionalManager: {
            name: "Sipho Modise",
            email: "s.modise@unitedtrolley.co.za",
            phone: "+27 11 555 0123",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 4.5,
          allowedBudgetType: "METRO_REPAIR_HIGH",
        },
        localization: {
          province: "Gauteng",
          currency: "ZAR" as const,
        },
      },
      {
        company: companyObjectId,
        name: "KZN Coastal",
        areaCode: "REG-KZN-01",
        isActive: true,
        leadership: {
          regionalManager: {
            name: "Priya Naidoo",
            email: "p.naidoo@unitedtrolley.co.za",
            phone: "+27 31 555 0456",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 5.0,
          allowedBudgetType: "STANDARD_REPAIR",
        },
        localization: {
          province: "KwaZulu-Natal",
          currency: "ZAR" as const,
        },
      },
      {
        company: companyObjectId,
        name: "Western Cape Metro",
        areaCode: "REG-WC-01",
        isActive: true,
        leadership: {
          regionalManager: {
            name: "Willem de Wet",
            email: "w.dewet@unitedtrolley.co.za",
            phone: "+27 21 555 0789",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 3.8,
          allowedBudgetType: "PREMIUM_REPAIR",
        },
        localization: {
          province: "Western Cape",
          currency: "ZAR" as const,
        },
      },
      {
        company: companyObjectId,
        name: "Eastern Cape Hub",
        areaCode: "REG-EC-01",
        isActive: true,
        leadership: {
          regionalManager: {
            name: "Lwazi Mthembu",
            email: "l.mthembu@unitedtrolley.co.za",
            phone: "+27 41 555 0991",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 5.5,
          allowedBudgetType: "STANDARD_REPAIR",
        },
        localization: {
          province: "Eastern Cape",
          currency: "ZAR" as const,
        },
      },
      {
        company: companyObjectId,
        name: "Free State Interior",
        areaCode: "REG-FS-01",
        isActive: true,
        leadership: {
          regionalManager: {
            name: "Johan Pretorius",
            email: "j.pretorius@unitedtrolley.co.za",
            phone: "+27 51 555 0222",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 6.0,
          allowedBudgetType: "RURAL_MAINTENANCE",
        },
        localization: {
          province: "Free State",
          currency: "ZAR" as const,
        },
      },
      {
        company: companyObjectId,
        name: "Mpumalanga East",
        areaCode: "REG-MP-01",
        isActive: true,
        leadership: {
          regionalManager: {
            name: "Thabo Ndlovu",
            email: "t.ndlovu@unitedtrolley.co.za",
            phone: "+27 13 555 0333",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 4.8,
          allowedBudgetType: "STANDARD_REPAIR",
        },
        localization: {
          province: "Mpumalanga",
          currency: "ZAR" as const,
        },
      },
      {
        company: companyObjectId,
        name: "Limpopo Northern Gateway",
        areaCode: "REG-LP-01",
        isActive: false, // Seeded as inactive to test UI filters/toggles
        leadership: {
          regionalManager: {
            name: "Ananias Baloyi",
            email: "a.baloyi@unitedtrolley.co.za",
            phone: "+27 15 555 0444",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 5.0,
          allowedBudgetType: "STANDARD_REPAIR",
        },
        localization: {
          province: "Limpopo",
          currency: "ZAR" as const,
        },
      },
    ];

    const seededAreas = await Area.create(areasToSeed);
    return seededAreas.map((a) => a._id.toString());
    console.log(
      `✅ Success: ${seededAreas.length} structural Areas mapped out securely.`,
    );
  } catch (error) {
    console.error("❌ Area Seeder run failed:", error);
    throw error;
  }
}
