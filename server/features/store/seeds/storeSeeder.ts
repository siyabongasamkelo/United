// 📂 File: server/src/features/store/seeds/storeSeeder.ts
import { Store } from "../models/Store";
import mongoose from "mongoose";

export interface IStoreSeedDependencies {
  branchId: string;
  storeGameId: string;
  storeClicksId: string;
}

export async function runStoreSeed(dependencies: IStoreSeedDependencies) {
  try {
    console.log("🛒 Store Seeder: Purging physical storefront entities...");
    await Store.deleteMany({});

    console.log(
      "🌱 Injecting core retail storefront entries with dynamic coordinate matrices...",
    );

    const branchObjId = new mongoose.Types.ObjectId(dependencies.branchId);

    // 🎯 YOUR EXACT PHYSICAL TESTING COORDINATES IN EMPANGENI!
    const testLat = -28.764306;
    const testLng = 31.879661;

    const storesToSeed = [
      // 1. GAME GATEWAY (Matches your system-wide SHARED_IDS.storeGame)
      {
        _id: new mongoose.Types.ObjectId(dependencies.storeGameId),
        branch: branchObjId,
        name: "GAME GATEWAY",
        storeCode: "GM-GAT-01",
        isActive: true,
        manager: {
          name: "Thabo Mokoena",
          email: "t.mokoena@retailers.co.za",
          phone: "+27 11 555 3011",
        },
        trolleyConfig: {
          minThreshold: 50,
          maxCapacity: 350,
          auditFrequency: "TWICE_DAILY" as const,
        },
        location: {
          address: "Shop 12, Gateway Shopping Centre, Gateway Boulevard",
          city: "Empangeni",
          province: "KwaZulu-Natal",
        },
        coordinates: {
          latitude: testLat,
          longitude: testLng,
        },
      },
      // 2. CLICKS GATEWAY (Matches your system-wide SHARED_IDS.storeClicks)
      {
        _id: new mongoose.Types.ObjectId(dependencies.storeClicksId),
        branch: branchObjId,
        name: "CLICKS GATEWAY",
        storeCode: "CL-GAT-04",
        isActive: true,
        manager: {
          name: "Jane van Wyk",
          email: "j.vanwyk@retailers.co.za",
          phone: "+27 11 555 3014",
        },
        trolleyConfig: {
          minThreshold: 20,
          maxCapacity: 120,
          auditFrequency: "DAILY" as const,
        },
        location: {
          address: "Shop 45, Gateway Shopping Centre, Gateway Boulevard",
          city: "Empangeni",
          province: "KwaZulu-Natal",
        },
        coordinates: {
          latitude: testLat,
          longitude: testLng,
        },
      },
      // 3. PICK N PAY GATEWAY HYPER
      {
        branch: branchObjId,
        name: "PICK N PAY GATEWAY HYPER",
        storeCode: "PNP-GAT-02",
        isActive: true,
        manager: {
          name: "David Govender",
          email: "d.govender@retailers.co.za",
          phone: "+27 11 555 3012",
        },
        trolleyConfig: {
          minThreshold: 80,
          maxCapacity: 500,
          auditFrequency: "TWICE_DAILY" as const,
        },
        location: {
          address: "Anchor Complex A, Gateway Shopping Centre",
          city: "Empangeni",
          province: "KwaZulu-Natal",
        },
        coordinates: {
          latitude: testLat,
          longitude: testLng,
        },
      },
    ];

    const seededStores = await Store.create(storesToSeed);
    console.log(
      `✅ Success: ${seededStores.length} commercial retail store targets initialized with spatial geofence trackers.`,
    );
  } catch (error) {
    console.error("❌ Store Seeder run failed:", error);
    throw error;
  }
}
