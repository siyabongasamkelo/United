import { FleetAudit, IFleetAudit } from "../models/FleetAudit";
import { Types } from "mongoose";

export class FleetAuditRepository {
  /**
   * Creates a new Fleet Audit record in the database.
   */
  async create(auditData: Partial<IFleetAudit>): Promise<IFleetAudit> {
    const audit = new FleetAudit(auditData);
    return await audit.save();
  }

  /**
   * Retrieves an audit by its unique ID, populated with references.
   */
  async findById(id: string): Promise<IFleetAudit | null> {
    return await FleetAudit.findById(id)
      .populate("store", "name code")
      .populate("branch", "name")
      .populate("company", "name")
      .populate("author", "firstName lastName email");
  }

  /**
   * Retrieves audits within a precise single-day window.
   * Matches audits from 00:00:00.000 to 23:59:59.999 of the specified date.
   */
  async findByDate(date: Date, storeId?: string): Promise<IFleetAudit[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query: any = {
      auditDate: { $gte: startOfDay, $lte: endOfDay },
    };

    if (storeId) {
      query.store = new Types.ObjectId(storeId);
    }

    return await FleetAudit.find(query)
      .populate("store branch company author", "name firstName lastName")
      .sort({ auditDate: -1 });
  }

  /**
   * Retrieves audits for a specific week based on a given start date.
   * Grabs data spanning exactly 7 days from the provided date.
   */
  async findByWeek(startDate: Date, storeId?: string): Promise<IFleetAudit[]> {
    const startOfWeek = new Date(startDate);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startDate);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    const query: any = {
      auditDate: { $gte: startOfWeek, $lt: endOfWeek },
    };

    if (storeId) {
      query.store = new Types.ObjectId(storeId);
    }

    return await FleetAudit.find(query)
      .populate("store branch company author", "name firstName lastName")
      .sort({ auditDate: -1 });
  }

  /**
   * Retrieves all audits for a particular month and year.
   */
  async findByMonth(
    year: number,
    month: number,
    storeId?: string,
  ): Promise<IFleetAudit[]> {
    // Note: JavaScript months are 0-indexed (January = 0, December = 11)
    const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const query: any = {
      auditDate: { $gte: startOfMonth, $lte: endOfMonth },
    };

    if (storeId) {
      query.store = new Types.ObjectId(storeId);
    }

    return await FleetAudit.find(query)
      .populate("store branch company author", "name firstName lastName")
      .sort({ auditDate: -1 });
  }

  /**
   * [Bonus Function] Aggregates historical metrics to help build charts easily.
   * Calculates overall average operational, damaged, and dirty rates over a timeframe.
   */
  async getHistoricalMetrics(startDate: Date, endDate: Date, storeId?: string) {
    const matchStage: any = {
      auditDate: { $gte: startDate, $lte: endDate },
    };

    if (storeId) {
      matchStage.store = new Types.ObjectId(storeId);
    }

    return await FleetAudit.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          avgTotalTrolleys: { $avg: "$metrics.total" },
          avgDamagedTrolleys: { $avg: "$metrics.damaged" },
          avgDirtyTrolleys: { $avg: "$metrics.dirty" },
          avgOperationalTrolleys: { $avg: "$metrics.operational" },
          totalAuditsPerformed: { $sum: 1 },
        },
      },
    ]);
  }
}
