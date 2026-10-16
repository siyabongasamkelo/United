// 📂 File: src/features/manager-console/services/managerConsoleService.ts
import { api } from "../../../shared/api/axiosInstance";

// ❶ Define the exact structure of what the backend sends back via deep population
export interface IAreaBranchResponse {
  _id: string;
  name: string; // E.g., "Gateway Theatre of Shopping"
  branchCode: string; // E.g., "BR-GAT-01"
  isActive: boolean;
  config: {
    branchType: "OPERATIONAL" | "HEADQUARTERS" | "STORAGE";
    hasRepairFacility: boolean;
  };
  contacts: {
    branchManager: {
      name: string;
      email: string;
      phone: string;
    };
  };
  logistics: {
    depotAddress: string;
    city: string;
  };
  area: {
    _id: string;
    name: string; // E.g., "KZN Coastal District"
  };
}

export class ManagerConsoleService {
  /**
   * GET: Fetches branches matching a specific supervisor area parameter constraint
   */
  static async fetchAreaBranches(
    areaId: string,
  ): Promise<IAreaBranchResponse[]> {
    const response = await api.get<{
      success: boolean;
      count: number;
      data: IAreaBranchResponse[];
    }>("/stores/area-branches", {
      params: { areaId },
    });
    return response.data.data;
  }

  static async fetchBranchLiveSummary(branchId: string) {
    const response = await api.get(`/stores/branch-deep-dive/${branchId}`);
    return response.data.data;
  }
}
