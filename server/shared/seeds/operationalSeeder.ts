import mongoose from "mongoose";
import { Company } from "../../features/company/models/Company";
import { Branch } from "../../features/branch/models/Branch";
import { Store } from "../../features/store/models/Store";
// ⚡ IMPORT YOUR USER MODEL BELOW:
// import { User } from "../../../features/users/models/User";

const SEED_IDS = {
  company: "651f1234567890abcdef0003",
  branch: "651f1234567890abcdef0002",
  storeGame: "651f1234567890abcdef0001",
  storeClicks: "651f1234567890abcdef0004",
  storeDischem: "651f1234567890abcdef0005",
};

export async function runOperationalSeed() {
  try {
    console.log(
      "🌱 Database Seeder: Purging existing structural corporate baselines...",
    );

    await Company.deleteMany({});
    await Branch.deleteMany({});
    await Store.deleteMany({});

    // 1. Seed Master Corporate Tenant
    const corporateTenant = await Company.create({
      _id: new mongoose.Types.ObjectId(SEED_IDS.company),
      name: "United Trolley Services (Pty) Ltd",
      registrationNumber: "2026/UTS/098765/07",
      isActive: true,
    });

    // 2. Seed Gateway Branch Context Boundary
    const gatewayBranch = await Branch.create({
      _id: new mongoose.Types.ObjectId(SEED_IDS.branch),
      company: corporateTenant._id,
      name: "Gateway Theatre of Shopping",
      locationCity: "Umhlanga",
      isActive: true,
    });

    // 3. Seed Gateway Retail Anchor Stores
    await Store.create([
      {
        _id: new mongoose.Types.ObjectId(SEED_IDS.storeGame),
        branch: gatewayBranch._id,
        name: "★ GAME STORE",
        storeCode: "UTS-GAM-GATE",
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId(SEED_IDS.storeClicks),
        branch: gatewayBranch._id,
        name: "CLICKS PHARMACY",
        storeCode: "UTS-CLK-GATE",
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId(SEED_IDS.storeDischem),
        branch: gatewayBranch._id,
        name: "DIS-CHEM",
        storeCode: "UTS-DIS-GATE",
        isActive: true,
      },
    ]);

    console.log("✅ Retail Stores Seeded cleanly into Gateway layout.");

    // ⚡ 4. HYDRATE YOUR ACTIVE TESTING USER PROFILE DIRECTLY
    // Look up your test account by its email or staff number and bind it to the branch keys
    /*
    const targetEmail = "YOUR_TEST_EMAIL_HERE@DOMAINS.COM"; // Drop your logged-in test email here!
    const updatedUser = await User.findOneAndUpdate(
      { email: targetEmail },
      { 
        branchId: gatewayBranch._id,
        companyId: corporateTenant._id,
        assignedStores: [
          { storeId: SEED_IDS.storeGame, storeName: "★ GAME STORE" },
          { storeId: SEED_IDS.storeClicks, storeName: "CLICKS PHARMACY" },
          { storeId: SEED_IDS.storeDischem, storeName: "DIS-CHEM" }
        ]
      },
      { new: true }
    );
    if (updatedUser) {
      console.log(`👑 User Profile Context Successfully Linked to Gateway: ${updatedUser.email}`);
    } else {
      console.log("⚠️ Warning: Could not find user record to update branch associations.");
    }
    */

    console.log(
      "🎉 Corporate structure hydration sequence complete! Ready for raw floor debugging.",
    );
  } catch (error) {
    console.error(
      "❌ Seeding transaction pipeline aborted due to failure:",
      error,
    );
  }
}
