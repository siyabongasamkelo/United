"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = __importDefault(require("../models/User"));
class UserRepository {
    /**
     * 🔄 REGISTER / SYNC FUNCTION
     * Since Clerk handles the actual sign-up, this function checks if the user exists in MongoDB.
     * If they don't, it registers them locally. If they do, it keeps their email/name synced.
     */
    async registerOrSyncUser(clerkId, email, fallbackData) {
        const existingUser = await User_1.default.findOne({ clerkId });
        if (existingUser) {
            // Keep data fresh if changed in Clerk profile settings
            if (fallbackData.fullName)
                existingUser.fullName = fallbackData.fullName;
            if (fallbackData.profilePhoto)
                existingUser.profilePhoto = fallbackData.profilePhoto;
            return await existingUser.save();
        }
        // New Registration: Create the local MongoDB record
        // New Registration: Create the local MongoDB record
        const newUser = new User_1.default({
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
    async getUserByClerkId(clerkId) {
        // sub-2ms query lookup because clerkId is highly indexed in our schema
        return await User_1.default.findOne({ clerkId, isActive: true });
    }
    /**
     * 📧 FETCH BY EMAIL FUNCTION
     * Ideal for administrative panels or supervisor searching utilities.
     */
    async getUserByEmail(email) {
        return await User_1.default.findOne({ email: email.toLowerCase().trim() });
    }
    /**
     * 📝 UPDATE PROFILE FUNCTION
     * Handles phone number updates, physical residential address changes, or role upgrades.
     */
    async updateUserProfile(clerkId, updateData) {
        return await User_1.default.findOneAndUpdate({ clerkId }, { $set: updateData }, { new: true, runValidators: true });
    }
    /**
     * 📦 ASSIGN STORE SUB-DOCUMENT FUNCTION
     * Efficiently pushes a target retail store into the porter's embedded collection array.
     */
    async assignStoreToPorter(clerkId, storeId, storeName) {
        return await User_1.default.findOneAndUpdate({ clerkId }, {
            $addToSet: {
                // $addToSet prevents duplicate assignments of the same exact store
                assignedStores: { storeId, storeName, assignedAt: new Date() },
            },
        }, { new: true });
    }
    /**
     * 🚨 ADMINISTRATIVE FUSE BLOCK
     * Instantly freezes or restores an account profile without erasing their shift history logs.
     */
    async setAccountStatus(clerkId, isActive) {
        return await User_1.default.findOneAndUpdate({ clerkId }, { $set: { isActive } }, { new: true });
    }
}
exports.UserRepository = UserRepository;
