export interface StoreAudit {
  id: number;
  storeName: string;
  totalTrolleys: number;
  weeklyDelta: number; // Positive for increase, negative for loss
  deltaPercentage: number;
  damagedCount: number;
  dirtyCount: number;
}

export const mockStoreAudits: StoreAudit[] = [
  {
    id: 1,
    storeName: "★ GAME STORE",
    totalTrolleys: 200,
    weeklyDelta: -5, // Lost 5 units
    deltaPercentage: -2.5,
    damagedCount: 8,
    dirtyCount: 9,
  },
  {
    id: 2,
    storeName: "CLICKS PHARMACY",
    totalTrolleys: 85,
    weeklyDelta: 3, // Gained 3 units
    deltaPercentage: 3.6,
    damagedCount: 2,
    dirtyCount: 4,
  },
  {
    id: 3,
    storeName: "DIS-CHEM",
    totalTrolleys: 120,
    weeklyDelta: 0, // Perfectly stable
    deltaPercentage: 0.0,
    damagedCount: 4,
    dirtyCount: 1,
  },
];
