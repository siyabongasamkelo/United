// 📂 File: server/src/features/store-visit/seeds/storeVisitSeeder.ts
import { StoreVisit } from "../models/StoreVisit";
import mongoose from "mongoose";

export interface IStoreVisitSeedDependencies {
  userId: string;
  branchId: string;
  storeGameId: string;
  storeClicksId: string;
}

export async function runStoreVisitSeed(
  dependencies: IStoreVisitSeedDependencies,
) {
  try {
    console.log(
      "📍 Store Visit Seeder: Purging scanning lifecycle timelines...",
    );
    await StoreVisit.deleteMany({});

    console.log(
      "🌱 Injecting 5 diversified proof-of-coverage tracking logs...",
    );

    const porterObjId = new mongoose.Types.ObjectId(dependencies.userId);
    const branchObjId = new mongoose.Types.ObjectId(dependencies.branchId);
    const gameStoreObjId = new mongoose.Types.ObjectId(
      dependencies.storeGameId,
    );
    const clicksStoreObjId = new mongoose.Types.ObjectId(
      dependencies.storeClicksId,
    );

    // Baseline coordinates for Gateway Mall Shopping Complex Anchor
    const baseLat = -26.1952;
    const baseLng = 28.0341;

    const visitsToSeed = [
      // 1. Perfectly Verified Sweep - Game Store
      {
        porter: porterObjId,
        store: gameStoreObjId,
        branch: branchObjId,
        scannedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        deviceCoordinates: { latitude: baseLat, longitude: baseLng },
        storeCoordinatesSnapshot: { latitude: baseLat, longitude: baseLng },
        distanceDelta: 1.2, // 1.2 meters away (Clean match)
        verificationStatus: "VERIFIED" as const,
        notes: "Standard mid-morning baseline drop of 5 ready units completed.",
      },
      // 2. High Priority Fraud Flag: Location Mismatch - Game Store
      {
        porter: porterObjId,
        store: gameStoreObjId,
        branch: branchObjId,
        scannedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        deviceCoordinates: {
          latitude: baseLat - 0.045,
          longitude: baseLng + 0.035,
        }, // Miles away
        storeCoordinatesSnapshot: { latitude: baseLat, longitude: baseLng },
        distanceDelta: 450.8, // 450 meters out of boundary limits
        verificationStatus: "LOCATION_MISMATCH" as const,
        notes:
          "Scan triggered outside operational storefront line corridor boundaries.",
      },
      // 3. Perfectly Verified Sweep - Clicks Store
      {
        porter: porterObjId,
        store: clicksStoreObjId,
        branch: branchObjId,
        scannedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        deviceCoordinates: {
          latitude: baseLat + 0.0001,
          longitude: baseLng - 0.0001,
        },
        storeCoordinatesSnapshot: { latitude: baseLat, longitude: baseLng },
        distanceDelta: 3.4,
        verificationStatus: "VERIFIED" as const,
        notes:
          "Lunch rush clearance sweep. Emptied frontend lobby stacks completely.",
      },
      // 4. Failed Telemetry / Degraded Signal Trace - Clicks Store
      {
        porter: porterObjId,
        store: clicksStoreObjId,
        branch: branchObjId,
        scannedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        deviceCoordinates: { latitude: 0, longitude: 0 }, // Bad GPS hardware dump
        storeCoordinatesSnapshot: { latitude: baseLat, longitude: baseLng },
        distanceDelta: 8500.0,
        verificationStatus: "FAILED_TELEMETRY" as const,
        notes:
          "Device browser rejected high-accuracy location extraction permissions.",
      },
      // 5. Fresh Live Sweep - Game Store
      {
        porter: porterObjId,
        store: gameStoreObjId,
        branch: branchObjId,
        scannedAt: new Date(), // Live right now
        deviceCoordinates: { latitude: baseLat, longitude: baseLng },
        storeCoordinatesSnapshot: { latitude: baseLat, longitude: baseLng },
        distanceDelta: 0.0, // Flawless spot-on position capture
        verificationStatus: "VERIFIED" as const,
        notes:
          "Handover check: evening shift transition inventory return completed.",
      },
    ];

    const seededVisits = await StoreVisit.create(visitsToSeed);
    console.log(
      `✅ Success: ${seededVisits.length} individual store coverage scans verified and logged.`,
    );
  } catch (error) {
    console.error("❌ Store Visit Seeder run failed:", error);
    throw error;
  }
}
