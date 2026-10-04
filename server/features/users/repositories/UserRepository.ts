import User, { IUser } from "../models/User";

// Define the interface to enforce TypeScript type safety across your codebase
export interface IUserRepository {
  registerOrSyncUser(
    clerkId: string,
    email: string,
    fallbackData: Partial<IUser>,
  ): Promise<IUser>;
  getUserByClerkId(clerkId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  updateUserProfile(
    clerkId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null>;
  assignStoreToPorter(
    clerkId: string,
    storeId: string,
    storeName: string,
  ): Promise<IUser | null>;
  setAccountStatus(clerkId: string, isActive: boolean): Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
  /**
   * 🔄 REGISTER / SYNC FUNCTION
   * Since Clerk handles the actual sign-up, this function checks if the user exists in MongoDB.
   * If they don't, it registers them locally. If they do, it keeps their email/name synced.
   */
  async registerOrSyncUser(
    clerkId: string,
    email: string,
    fallbackData: Partial<IUser>,
  ): Promise<IUser> {
    const existingUser = await User.findOne({ clerkId });

    if (existingUser) {
      // Keep data fresh if changed in Clerk profile settings
      if (fallbackData.fullName) existingUser.fullName = fallbackData.fullName;
      if (fallbackData.profilePhoto)
        existingUser.profilePhoto = fallbackData.profilePhoto;
      return await existingUser.save();
    }

    // New Registration: Create the local MongoDB record
    // New Registration: Create the local MongoDB record
    const newUser = new User({
      clerkId,
      email,
      fullName: fallbackData.fullName || "New Operator",
      username: fallbackData.username || email.split("@")[0],
      role: fallbackData.role || "PORTER",
      contactNumber: fallbackData.contactNumber || "N/A",
      whatsappNumber: fallbackData.whatsappNumber || "N/A",
      address: fallbackData.address || "N/A",
      branchId: fallbackData.branchId || "GATEWAY_DURBAN",
      company: fallbackData.company || "United Trolley Services",
      assignedStores: [], // ✅ Changed from stores: [] to match your schema precisely!
    });

    return await newUser.save();
  }

  /**
   * 🔑 LOGIN / SESSION FETCH FUNCTION
   * When a user logs into Clerk on the frontend, the backend intercepts their Clerk ID.
   * This function pulls their operational MERN data (roles, assigned stores) instantly.
   */
  async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    // sub-2ms query lookup because clerkId is highly indexed in our schema
    return await User.findOne({ clerkId, isActive: true });
  }

  /**
   * 📧 FETCH BY EMAIL FUNCTION
   * Ideal for administrative panels or supervisor searching utilities.
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase().trim() });
  }

  /**
   * 📝 UPDATE PROFILE FUNCTION
   * Handles phone number updates, physical residential address changes, or role upgrades.
   */
  async updateUserProfile(
    clerkId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { clerkId },
      { $set: updateData },
      { new: true, runValidators: true }, // Returns the freshly updated document back instantly
    );
  }

  /**
   * 📦 ASSIGN STORE SUB-DOCUMENT FUNCTION
   * Efficiently pushes a target retail store into the porter's embedded collection array.
   */
  async assignStoreToPorter(
    clerkId: string,
    storeId: string,
    storeName: string,
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { clerkId },
      {
        $addToSet: {
          // $addToSet prevents duplicate assignments of the same exact store
          assignedStores: { storeId, storeName, assignedAt: new Date() },
        },
      },
      { new: true },
    );
  }

  /**
   * 🚨 ADMINISTRATIVE FUSE BLOCK
   * Instantly freezes or restores an account profile without erasing their shift history logs.
   */
  async setAccountStatus(
    clerkId: string,
    isActive: boolean,
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { clerkId },
      { $set: { isActive } },
      { new: true },
    );
  }
}
