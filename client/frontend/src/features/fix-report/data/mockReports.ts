export interface DefectReport {
  id: string;
  trolleyNumber: string;
  storeOrigin: "★ GAME STORE" | "CLICKS PHARMACY" | "DIS-CHEM";
  brokenPart: "Chassis" | "Wire Basket" | "Back-Gate" | "Castor Wheels";
  severity: "Low" | "Medium" | "High";
  loggedAt: string;
  status: "Pending Repair" | "Under Maintenance" | "Fixed";
}

export const mockDefectReports: DefectReport[] = [
  {
    id: "REP-102",
    trolleyNumber: "UTS-042",
    storeOrigin: "★ GAME STORE",
    brokenPart: "Castor Wheels",
    severity: "High",
    loggedAt: "2026-10-01T08:30:00Z",
    status: "Pending Repair",
  },
  {
    id: "REP-103",
    trolleyNumber: "UTS-015",
    storeOrigin: "DIS-CHEM",
    brokenPart: "Back-Gate",
    severity: "Medium",
    loggedAt: "2026-10-01T11:15:00Z",
    status: "Under Maintenance",
  },
];
