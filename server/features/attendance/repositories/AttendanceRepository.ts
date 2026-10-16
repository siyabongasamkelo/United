// 📂 File: features/attendance/repositories/AttendanceRepository.ts
import { AttendanceLog, IAttendanceLog } from "../models/AttendanceLog";
import { Types } from "mongoose";

export class AttendanceRepository {
  // Center Coordinate Constants for Gateway Theatre of Shopping (Umhlanga)
  private readonly GATEWAY_LAT = -29.7259; //
  private readonly GATEWAY_LNG = 31.0664; //
  private readonly MAX_RADIUS_METERS = 200; // Strict boundary constraint line

  /**
   * Applies the Haversine formula to compute distance over the Earth's spherical surface
   */
  calculateDistanceToGateway(userLat: number, userLng: number): number {
    const EarthRadiusKm = 6371; //
    const dLat = ((userLat - this.GATEWAY_LAT) * Math.PI) / 180; //
    const dLng = ((userLng - this.GATEWAY_LNG) * Math.PI) / 180; //

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.GATEWAY_LAT * Math.PI) / 180) *
        Math.cos((userLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2); //

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); //
    const distanceMeters = EarthRadiusKm * c * 1000; //

    return distanceMeters; //
  }

  /**
   * PERSIST CORE SESSION: Creates a brand new clock-in transaction entry log
   */
  async createLog(logData: Partial<IAttendanceLog>): Promise<IAttendanceLog> {
    const log = new AttendanceLog(logData); //
    return await log.save(); //
  }

  /**
   * SHIFT LIFECYCLE CLOSURE: Updates an existing active record with clock-out coordinates and timestamps
   */
  async finalizeClockOut(
    userId: string,
    branchId: string,
    clockOutData: { latitude: number; longitude: number },
  ): Promise<IAttendanceLog | null> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Locates an active shift log registered by this specific worker today
    return await AttendanceLog.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
        branch: new Types.ObjectId(branchId),
        status: "ACTIVE",
        clockInTime: { $gte: startOfToday, $lte: endOfToday },
      },
      {
        $set: {
          status: "CLOCKED_OUT",
          clockOutTime: new Date(),
          clockOutLatitude: clockOutData.latitude,
          clockOutLongitude: clockOutData.longitude,
        },
      },
      { new: true }, // Returns the freshly updated dataset document configuration
    );
  }

  /**
   * PERSONAL LOG RECOVERY: Fetches all history entries logged by a single user within the current day
   */
  async findPersonalLogsToday(userId: string): Promise<IAttendanceLog[]> {
    const startOfDay = new Date(); //
    startOfDay.setHours(0, 0, 0, 0); //

    const endOfDay = new Date(); //
    endOfDay.setHours(23, 59, 59, 999); //

    return await AttendanceLog.find({
      //
      user: new Types.ObjectId(userId), //
      clockInTime: { $gte: startOfDay, $lte: endOfDay }, //
    }).sort({ clockInTime: -1 }); //
  }

  /**
   * 🛰️ MANAGER LIVE DESK ACCELERATOR: Uncoupled cross-talk pipeline query
   * Instantly fetches only the personnel currently working on the store floor right now!
   */
  async findActivePortersToday(branchId: string): Promise<IAttendanceLog[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return await AttendanceLog.find({
      branch: new Types.ObjectId(branchId),
      status: "ACTIVE", // 🔥 Ultra-fast index optimization! Skips looking at finished logs.
      clockInTime: { $gte: startOfToday, $lte: endOfToday },
    })
      .populate("user", "fullName email contactNumber role")
      .sort({ clockInTime: 1 });
  }

  getGeofenceThreshold() {
    return this.MAX_RADIUS_METERS;
  }
}
