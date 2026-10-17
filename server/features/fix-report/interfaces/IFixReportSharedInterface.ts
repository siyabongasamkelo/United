import { Types } from "mongoose";

export interface IFixReportSharedInterface {
  /**
   * Calculates live, active, unresolved asset metrics for a specific store.
   * Completely avoids cross-feature database coupling.
   */
  getActiveMetricsByStore(storeId: string | Types.ObjectId): Promise<{
    activeBrokenCount: number;
    activeDirtyCount: number;
  }>;
}
