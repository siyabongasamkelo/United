import { api } from "../../../shared/api/axiosInstance";

// ❶ Define TypeScript types for our UI requests and backend responses
export interface ITrolleyMetrics {
  total: number;
  damaged: number;
  dirty: number;
  operational: number;
}

export interface IFleetAuditResponse {
  _id: string;
  auditDate: string;
  store: { _id: string; name: string; code?: string };
  branch: { _id: string; name: string };
  company: { _id: string; name: string };
  author: { _id: string; firstName: string; lastName: string; email: string };
  metrics: ITrolleyMetrics;
  images: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAuditPayload {
  auditDate: string;
  store: string;
  branch: string;
  company: string;
  metrics: {
    total: number;
    damaged: number;
    dirty: number;
  };
  images?: string[];
  notes?: string;
}

export interface IAnalyticsSummary {
  avgTotalTrolleys: number;
  avgDamagedTrolleys: number;
  avgDirtyTrolleys: number;
  avgOperationalTrolleys: number;
  totalAuditsPerformed: number;
}

// ❷ Pure Service Class containing isolated network functions
export class FleetAuditService {
  /**
   * POST: Submits a fresh fleet audit record from the floor
   */
  static async submitAudit(
    payload: ICreateAuditPayload,
  ): Promise<IFleetAuditResponse> {
    const response = await api.post<{
      success: boolean;
      data: IFleetAuditResponse;
    }>("/fleet-audits", payload);
    return response.data.data;
  }

  /**
   * GET: Fetches a single audit document with fully populated text details
   */
  static async getAuditById(id: string): Promise<IFleetAuditResponse> {
    const response = await api.get<{
      success: boolean;
      data: IFleetAuditResponse;
    }>(`/fleet-audits/detail/${id}`);
    return response.data.data;
  }

  /**
   * GET: Fetches records matching a single daily date window
   */
  static async getDailyAudits(
    date: string,
    storeId?: string,
  ): Promise<IFleetAuditResponse[]> {
    const params: Record<string, string> = { date };
    if (storeId) params.storeId = storeId;

    const response = await api.get<{
      success: boolean;
      data: IFleetAuditResponse[];
    }>("/fleet-audits/daily", { params });
    return response.data.data;
  }

  /**
   * GET: Fetches a 7-day span from a starting timestamp
   */
  static async getWeeklyAudits(
    startDate: string,
    storeId?: string,
  ): Promise<IFleetAuditResponse[]> {
    const params: Record<string, string> = { startDate };
    if (storeId) params.storeId = storeId;

    const response = await api.get<{
      success: boolean;
      data: IFleetAuditResponse[];
    }>("/fleet-audits/weekly", { params });
    return response.data.data;
  }

  /**
   * GET: Fetches records organized across a whole calendar month
   */
  static async getMonthlyAudits(
    year: number,
    month: number,
    storeId?: string,
  ): Promise<IFleetAuditResponse[]> {
    const params: Record<string, string> = {
      year: String(year),
      month: String(month),
    };
    if (storeId) params.storeId = storeId;

    const response = await api.get<{
      success: boolean;
      data: IFleetAuditResponse[];
    }>("/fleet-audits/monthly", { params });
    return response.data.data;
  }

  /**
   * GET: Aggregates historical metrics for dashboard analytics charts
   */
  static async getAuditAnalytics(
    startDate: string,
    endDate: string,
    storeId?: string,
  ): Promise<IAnalyticsSummary[]> {
    const params: Record<string, string> = { startDate, endDate };
    if (storeId) params.storeId = storeId;

    const response = await api.get<{
      success: boolean;
      data: IAnalyticsSummary[];
    }>("/fleet-audits/analytics", { params });
    return response.data.data;
  }
}
