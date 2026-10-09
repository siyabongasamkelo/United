import { api } from "../../../shared/api/axiosInstance";

export interface IFixReportResponse {
  _id: string;
  trolleyId: string;
  storeOrigin: { _id: string; storeName: string; storeCode?: string };
  brokenComponent:
    | "CASTOR_WHEELS"
    | "BACK_GATE"
    | "CHASSIS_FRAME"
    | "ROPE_STEER_MOUNT"
    | "OTHER";
  damageSeverity: "LOW" | "MEDIUM" | "HIGH";
  maintenanceStatus: "PENDING_REPAIR" | "UNDER_MAINTENANCE" | "RESOLVED";
  reportedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    staffNumber?: string;
  };
  notes?: string;
  evidenceImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateFixReportPayload {
  trolleyId: string;
  storeOriginId: string;
  brokenComponent:
    | "CASTOR_WHEELS"
    | "BACK_GATE"
    | "CHASSIS_FRAME"
    | "ROPE_STEER_MOUNT"
    | "OTHER";
  damageSeverity: "LOW" | "MEDIUM" | "HIGH";
  notes?: string;
  evidenceImageUrl?: string;
}

export class FixReportService {
  /**
   * POST: Registers a broken trolley log from the floor into the maintenance queue
   */
  static async submitFaultReport(
    payload: ICreateFixReportPayload,
  ): Promise<IFixReportResponse> {
    const response = await api.post<{
      success: boolean;
      data: IFixReportResponse;
    }>("/fix-reports/report-fault", payload);
    return response.data.data;
  }

  /**
   * GET: Retrieves all pending and active assets inside the workshop yard
   */
  static async getActiveMaintenanceQueue(): Promise<IFixReportResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: IFixReportResponse[];
    }>("/fix-reports/maintenance-queue");
    return response.data.data;
  }
}
