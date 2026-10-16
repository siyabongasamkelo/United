import { api } from "../../../shared/api/axiosInstance";

export interface IStoreScanPayload {
  storeId: string;
  latitude: number;
  longitude: number;
}

export interface IStoreVisitResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    verificationStatus: "VERIFIED" | "LOCATION_MISMATCH" | "FAILED_TELEMETRY";
    distanceDelta: number;
    scannedAt: string;
  };
}

export class StoreVisitService {
  /**
   * Dispatches decoded QR text data and device hardware coordinates to the backend gate.
   */
  static async submitStoreScan(
    payload: IStoreScanPayload,
  ): Promise<IStoreVisitResponse> {
    const response = await api.post<IStoreVisitResponse>(
      "/store-visits/scan",
      payload,
    );
    return response.data;
  }
}
