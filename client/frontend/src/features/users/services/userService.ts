import { api } from "../../../shared/api/axiosInstance";

// ❶ Replicate the strict backend type interfaces locally for complete frontend autocomplete safety
export interface IAssignedStore {
  storeId: string;
  storeName: string;
  assignedAt: string;
}

export interface IUserProfile {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  fullName: string;
  contactNumber: string;
  whatsappNumber: string;
  address: string;
  role: "PORTER" | "SUPERVISOR" | "AREA_MANAGER" | "SYSTEM_ADMIN";
  company: string;
  branchId: string | null;
  profilePhoto: string;
  assignedStores: IAssignedStore[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISyncUserPayload {
  clerkId: string;
  email: string;
  username: string;
  fullName: string;
  contactNumber: string;
  whatsappNumber: string;
  address: string;
  role: "PORTER" | "SUPERVISOR" | "AREA_MANAGER" | "SYSTEM_ADMIN";
  company?: string;
  branchId?: string | null;
  profilePhoto?: string;
  assignedStores?: { storeId: string; storeName: string }[];
}

export class UserService {
  /**
   * GET: Fetches the rich MongoDB user profile metadata using the authenticated session context
   */
  static async getUserProfile(): Promise<IUserProfile> {
    // Hits router.get("/profile", clerkAuth, controller.getProfile) on backend
    const response = await api.get<{ success: boolean; data: IUserProfile }>(
      "/users/profile",
    );
    return response.data.data;
  }

  /**
   * POST: Synchronizes or registers a new identity boundary block across our local system records
   */
  static async syncUserProfile(
    payload: ISyncUserPayload,
  ): Promise<IUserProfile> {
    // Hits router.post("/sync", controller.onboardOrSync) on backend
    const response = await api.post<{ success: boolean; data: IUserProfile }>(
      "/users/sync",
      payload,
    );
    return response.data.data;
  }
}
