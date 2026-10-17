// 📂 File: server/src/features/user/seeds/userSeeder.ts
import User from "../models/User";
import mongoose from "mongoose";

export interface IUserSeedDependencies {
  sharedUserId: string;
  branchId: string;
  storeGameId: string;
  storeClicksId: string;
}

export async function runUserSeed(dependencies: IUserSeedDependencies) {
  try {
    console.log("👤 User Seeder: Purging existing user profiles...");
    await User.deleteMany({});

    console.log("🌱 Injecting role-diversified workforce user profiles...");

    const usersToSeed = [
      // 1. Core Field Staff Porter (Matches your system-wide SHARED_IDS.userWorker)
      {
        _id: new mongoose.Types.ObjectId(dependencies.sharedUserId),
        clerkId: "user_clerk_porter_001",
        email: "s.modise@unitedtrolley.co.za",
        username: "porter_sipho",
        fullName: "Sipho Modise",
        contactNumber: "+27 82 555 0191",
        whatsappNumber: "+27 82 555 0191",
        address: "14 Juta Street, Braamfontein, Johannesburg",
        role: "PORTER" as const,
        company: "United Trolley Services",
        branchId: dependencies.branchId,
        profilePhoto: "https://clerk.com",
        assignedStores: [
          {
            storeId: dependencies.storeGameId,
            storeName: "GAME GATEWAY",
            assignedAt: new Date(),
          },
          {
            storeId: dependencies.storeClicksId,
            storeName: "CLICKS GATEWAY",
            assignedAt: new Date(),
          },
        ],
        isActive: true,
      },
      // 2. Operations Supervisor (Authorized to view administrative metrics)
      {
        clerkId: "user_clerk_supervisor_002",
        email: "p.naidoo@unitedtrolley.co.za",
        username: "super_priya",
        fullName: "Priya Naidoo",
        contactNumber: "+27 71 555 0422",
        whatsappNumber: "+27 71 555 0422",
        address: "88 Marine Drive, Umhlanga, Durban",
        role: "SUPERVISOR" as const,
        company: "United Trolley Services",
        branchId: dependencies.branchId,
        profilePhoto: "https://clerk.com",
        assignedStores: [],
        isActive: true,
      },
      // 3. Regional Area Manager (Cross-branch authorization)
      {
        clerkId: "user_clerk_manager_003",
        email: "w.dewet@unitedtrolley.co.za",
        username: "manager_willem",
        fullName: "Willem de Wet",
        contactNumber: "+27 83 555 0733",
        whatsappNumber: "+27 83 555 0733",
        address: "42 Constantia Road, Cape Town",
        role: "AREA_MANAGER" as const,
        company: "United Trolley Services",
        branchId: null, // Gracefully drops to null for Area Managers as per model specification
        profilePhoto: "https://clerk.com",
        assignedStores: [],
        isActive: true,
      },
      // 4. System Administrator
      {
        clerkId: "user_clerk_admin_004",
        email: "admin@unitedtrolley.co.za",
        username: "sys_admin",
        fullName: "Admin Account",
        contactNumber: "+27 11 555 0100",
        whatsappNumber: "+27 11 555 0100",
        address: "HQ Corporate Building, Sandton",
        role: "SYSTEM_ADMIN" as const,
        company: "United Trolley Services",
        branchId: dependencies.branchId,
        profilePhoto: "https://clerk.com",
        assignedStores: [],
        isActive: true,
      },
    ];

    const seededUsers = await User.create(usersToSeed);
    console.log(
      `✅ Success: ${seededUsers.length} platform user profiles initialized and active.`,
    );
  } catch (error) {
    console.error("❌ User Seeder run failed:", error);
    throw error;
  }
}
