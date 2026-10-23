// 📂 File: src/features/attendance/services/attendanceService.ts

import { api } from "../../../shared/api/axiosInstance";

export interface IPpeDeclaration {
  hasSafetyBoots: boolean;
  hasReflectorVest: boolean;
  hasSteeringRope: boolean;
}

export interface IClockInPayload {
  branchId: string;
  shiftWave: "MORNING" | "REINFORCEMENT" | "NIGHT_SWEEPERS";
  latitude: number;
  longitude: number;
  ppeDeclaration: IPpeDeclaration;
}

// 🆕 ADD THIS INTERFACE FOR THE CLOCK OUT REQUEST
export interface IClockOutPayload {
  branchId: string;
  latitude: number;
  longitude: number;
}

export interface IAttendanceLogResponse {
  _id: string;
  user: string;
  branch: string;
  shiftWave: "MORNING" | "REINFORCEMENT" | "NIGHT_SWEEPERS";
  status: "ACTIVE" | "CLOCKED_OUT" | "BREAK"; // 🆕 Tracks the current log state
  clockInTime: string;
  clockOutTime?: string; // 🆕 Added matching database lifecycle schema
  latitude: number;
  longitude: number;
  isGeofenceVerified: boolean;
  ppeDeclaration: IPpeDeclaration;
  createdAt: string;
}

export class AttendanceService {
  /**
   * POST: Transmits GPS vectors and un-skippable PPE checklist metrics
   */
  static async clockIn(
    payload: IClockInPayload,
  ): Promise<IAttendanceLogResponse> {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: IAttendanceLogResponse;
    }>("/attendance/clock-in", payload);
    return response.data.data;
  }

  /**
   * 🆕 POST: Transmits final GPS coordinates to conclude the shift lifecycle safely
   */
  static async clockOut(
    payload: IClockOutPayload,
  ): Promise<IAttendanceLogResponse> {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: IAttendanceLogResponse;
    }>("/attendance/clock-out", payload);
    return response.data.data;
  }

  /**
   * GET: Pulls today's history logs for the authenticated worker
   */
  static async getMyTodayLogs(): Promise<IAttendanceLogResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: IAttendanceLogResponse[];
    }>("/attendance/my-today-logs");
    return response.data.data;
  }
}
