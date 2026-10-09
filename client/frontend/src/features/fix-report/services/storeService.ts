import { api } from "../../../shared/api/axiosInstance";

export interface IStoreResponse {
  _id: string;
  branch: string;
  name: string;
  storeCode: string;
  isActive: boolean;
}

export class StoreService {
  /**
   * GET: Fetches seeded retail stores matching the logged-in supervisor's branch context layout [3.2]
   */
  static async getMyBranchStores(): Promise<IStoreResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: IStoreResponse[];
    }>("/stores/my-branch-stores");
    return response.data.data;
  }
}
