// 📂 File: server/shared/seeds/operationalSeeder.ts
import mongoose from "mongoose";
import { Company } from "../../features/company/models/Company";
import { Area } from "../../features/area/models/Area";
import { Branch } from "../../features/branch/models/Branch";
import { Store } from "../../features/store/models/Store";
import { AttendanceLog } from "../../features/attendance/models/AttendanceLog";
import User from "../../features/users/models/User"; // 🚀 FIXED: Imported as default to match file export schema!

const SEED_IDS = {
  company: "651f1234567890abcdef0003",
  areaKznCoastal: "651f1234567890abcdef0010",
  areaKznCentral: "651f1234567890abcdef0011",
  areaKznSouth: "651f1234567890abcdef0012",
  branchGateway: "651f1234567890abcdef0002",
  branchPavilion: "651f1234567890abcdef0020",
  branchGalleria: "651f1234567890abcdef0021",
  storeGame: "651f1234567890abcdef0001",
  storeClicks: "651f1234567890abcdef0004",
  storeDischem: "651f1234567890abcdef0005",
};

export async function runOperationalSeed() {
  try {
    console.log("🌱 Database Seeder: Purging existing baseline datasets...");
    await Company.deleteMany({});
    await Area.deleteMany({});
    await Branch.deleteMany({});
    await Store.deleteMany({});
    await AttendanceLog.deleteMany({});
    await User.deleteMany({ role: "PORTER" });

    // 1. Seed Master Corporate Tenant Anchor
    const corporateTenant = await Company.create({
      _id: new mongoose.Types.ObjectId(SEED_IDS.company),
      name: "United Trolley Services (Pty) Ltd",
      registrationNumber: "2026/UTS/098765/07",
      isActive: true,
    });

    // 2. Seed Regional Areas matching our Manager Console views
    await Area.create([
      {
        _id: new mongoose.Types.ObjectId(SEED_IDS.areaKznCoastal),
        company: corporateTenant._id,
        name: "KZN Coastal District",
        areaCode: "REG-KZN-CST",
        isActive: true,
        leadership: {
          regionalManager: {
            name: "M. Khumalo",
            email: "khumalo.ops@united.co.za",
            phone: "+27820000001",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 4.5,
          allowedBudgetType: "STANDARD_REPAIR",
        },
        localization: { province: "KwaZulu-Natal", currency: "ZAR" },
      },
      {
        _id: new mongoose.Types.ObjectId(SEED_IDS.areaKznCentral),
        company: corporateTenant._id,
        name: "KZN Central District",
        areaCode: "REG-KZN-CEN",
        isActive: true,
        leadership: {
          regionalManager: {
            name: "S. Naidoo",
            email: "naidoo.ops@united.co.za",
            phone: "+27820000002",
          },
        },
        regionalKPIs: {
          targetLossRateCeiling: 5.0,
          allowedBudgetType: "STANDARD_REPAIR",
        },
        localization: { province: "KwaZulu-Natal", currency: "ZAR" },
      },
    ]);

    // 3. Seed Local Branch Operational Hub Boundaries
    const gatewayBranch = await Branch.create({
      _id: new mongoose.Types.ObjectId(SEED_IDS.branchGateway),
      area: new mongoose.Types.ObjectId(SEED_IDS.areaKznCoastal),
      name: "Gateway Theatre of Shopping",
      branchCode: "BR-GAT-01",
      isActive: true,
      config: { branchType: "HEADQUARTERS", hasRepairFacility: true },
      contacts: {
        branchManager: {
          name: "A. Mthembu",
          email: "mthembu.gate@united.co.za",
          phone: "+27601234567",
        },
      },
      logistics: { depotAddress: "1 Palm Blvd, Umhlanga", city: "Durban" },
    });

    // 4. Seed Retail Partner Anchor Store Locations
    await Store.create([
      {
        _id: new mongoose.Types.ObjectId(SEED_IDS.storeGame),
        branch: gatewayBranch._id,
        name: "★ GAME STORE",
        storeCode: "UTS-GAM-GATE",
        isActive: true,
        manager: {
          name: "G. Manager",
          email: "manager.game@retail.co.za",
          phone: "+27310000001",
        },
        trolleyConfig: {
          minThreshold: 150,
          maxCapacity: 500,
          auditFrequency: "TWICE_DAILY",
        },
        location: {
          address: "Shop 50, Gateway Mall",
          city: "Umhlanga",
          province: "KwaZulu-Natal",
        },
      },
      {
        _id: new mongoose.Types.ObjectId(SEED_IDS.storeClicks),
        branch: gatewayBranch._id,
        name: "CLICKS PHARMACY",
        storeCode: "UTS-CLK-GATE",
        isActive: true,
        manager: {
          name: "C. Manager",
          email: "manager.clicks@retail.co.za",
          phone: "+27310000002",
        },
        trolleyConfig: {
          minThreshold: 50,
          maxCapacity: 150,
          auditFrequency: "DAILY",
        },
        location: {
          address: "Shop 12, Gateway Mall",
          city: "Umhlanga",
          province: "KwaZulu-Natal",
        },
      },
    ]);

    // 🚀 5. SEED PERSONNEL POOL MATCHING THE NEW MAPPING RULES EXPLICITLY
    console.log("👥 Seeding active dummy porter profiles...");
    const dummyWorkers = await User.create([
      {
        clerkId: "user_clerk_mock_id_001",
        email: "thabo.n@united.co.za",
        username: "thabo_porter1",
        fullName: "Thabo Ndlovu",
        contactNumber: "+27821234567",
        whatsappNumber: "+27821234567",
        address: "74 Umhlanga Rocks Dr, Durban",
        role: "PORTER",
        company: "United Trolley Services",
        branchId: String(gatewayBranch._id),
        isActive: true,
        assignedStores: [
          {
            storeId: SEED_IDS.storeGame,
            storeName: "★ GAME STORE",
            assignedAt: new Date(),
          },
        ],
      },
      {
        clerkId: "user_clerk_mock_id_002",
        email: "sipho.d@united.co.za",
        username: "sipho_porter2",
        fullName: "Sipho Dlamini",
        contactNumber: "+27839876543",
        whatsappNumber: "+27839876543",
        address: "12 Garvies Rd, Bluff, Durban",
        role: "PORTER",
        company: "United Trolley Services",
        branchId: String(gatewayBranch._id),
        isActive: true,
        assignedStores: [
          {
            storeId: SEED_IDS.storeClicks,
            storeName: "CLICKS PHARMACY",
            assignedAt: new Date(),
          },
        ],
      },
      {
        clerkId: "user_clerk_mock_id_003",
        email: "brandon.g@united.co.za",
        username: "brandon_porter3",
        fullName: "Brandon Govender",
        contactNumber: "+27714567890",
        whatsappNumber: "+27714567890",
        address: "45 Broad St, Durban Central",
        role: "PORTER",
        company: "United Trolley Services",
        branchId: String(gatewayBranch._id),
        isActive: true,
        assignedStores: [],
      },
    ]);

    // 🚀 6. AUTOMATED SHIFT LOGGER SIMULATOR (Tied straight to today's date window)
    console.log("⏱️ Generating synchronized shift entries for today...");
    const todayStart = new Date();
    todayStart.setHours(6, 0, 0, 0);

    for (let i = 0; i < dummyWorkers.length; i++) {
      const workerTime = new Date(todayStart);
      workerTime.setMinutes(workerTime.getMinutes() + i * 7);

      await AttendanceLog.create({
        user: dummyWorkers[i]._id,
        branch: gatewayBranch._id,
        shiftWave: i % 2 === 0 ? "MORNING" : "REINFORCEMENT",
        status: "ACTIVE",
        clockInTime: workerTime,
        latitude: -29.7259 + i * 0.0001,
        longitude: 31.0664 - i * 0.0001,
        isGeofenceVerified: true,
        ppeDeclaration: {
          hasSafetyBoots: true,
          hasReflectorVest: true,
          hasSteeringRope: true,
        },
        telemetry: { batteryLevel: 0.92, platform: "Android" },
        shiftNotes:
          "Seeded automatically via system shift startup pipeline simulator grid.",
      });
    }

    console.log(
      "🎉 Success: Seeder file configurations match your User schema parameters perfectly!",
    );
  } catch (error) {
    console.error(
      "❌ Seeding transaction pipeline aborted due to failure:",
      error,
    );
  }
}
