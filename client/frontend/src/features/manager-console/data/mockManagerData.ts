// src/features/manager-console/data/mockManagerData.ts

export interface IFloorPorter {
  id: string;
  fullName: string;
  role: string;
  phoneNumber: string;
  clockInTime: string;
}

export interface IStoreVisitCount {
  id: string;
  storeName: string;
  visitsCount: number;
}

export interface IBranchDetailedSummary {
  branchId: string;
  branchName: string;
  district: string;
  supervisorName: string;
  lastNightCount: number;
  totalPortersOnFloor: number;
  livePorters: IFloorPorter[];
  storeVisitsToday: IStoreVisitCount[];
}

export const mockManagerBranches: IBranchDetailedSummary[] = [
  {
    branchId: "gateway",
    branchName: "Gateway Theatre of Shopping",
    district: "KZN Coastal District",
    supervisorName: "M. Khumalo",
    lastNightCount: 405, // Combined total across anchors last night
    totalPortersOnFloor: 12,
    livePorters: [
      {
        id: "p1",
        fullName: "Thabo Ndlovu",
        role: "Wave 1 - Morning Lead",
        phoneNumber: "+27821234567",
        clockInTime: "06:02 AM",
      },
      {
        id: "p2",
        fullName: "Sipho Dlamini",
        role: "Wave 1 - Porter",
        phoneNumber: "+27839876543",
        clockInTime: "06:15 AM",
      },
      {
        id: "p3",
        fullName: "Brandon Govender",
        role: "Wave 2 - Reinforcement",
        phoneNumber: "+27714567890",
        clockInTime: "09:45 AM",
      },
      {
        id: "p4",
        fullName: "Andile Mthembu",
        role: "Supervisor / Core Driver",
        phoneNumber: "+27601234567",
        clockInTime: "05:45 AM",
      },
    ],
    storeVisitsToday: [
      { id: "v1", storeName: "★ GAME STORE", visitsCount: 14 },
      { id: "v2", storeName: "CLICKS PHARMACY", visitsCount: 9 },
      { id: "v3", storeName: "DIS-CHEM", visitsCount: 11 },
    ],
  },
  {
    branchId: "pavilion",
    branchName: "The Pavilion Shopping Centre",
    district: "KZN Central District",
    supervisorName: "S. Naidoo",
    lastNightCount: 310,
    totalPortersOnFloor: 8,
    livePorters: [
      {
        id: "p5",
        fullName: "Ruan Botha",
        role: "Wave 1 - Morning Lead",
        phoneNumber: "+27824445555",
        clockInTime: "06:00 AM",
      },
      {
        id: "p6",
        fullName: "Devan Pillay",
        role: "Wave 2 - Porter",
        phoneNumber: "+27731112222",
        clockInTime: "09:50 AM",
      },
    ],
    storeVisitsToday: [
      { id: "v4", storeName: "CHECKERS HYPER", visitsCount: 18 },
      { id: "v5", storeName: "PICK N PAY", visitsCount: 12 },
    ],
  },
  {
    branchId: "galleria",
    branchName: "Galleria Mall",
    district: "KZN South Coast",
    supervisorName: "J. Zuma",
    lastNightCount: 245,
    totalPortersOnFloor: 6,
    livePorters: [
      {
        id: "p7",
        fullName: "Lungani Cele",
        role: "Wave 1 - Morning Lead",
        phoneNumber: "+27618889999",
        clockInTime: "06:10 AM",
      },
    ],
    storeVisitsToday: [
      { id: "v6", storeName: "WOOLWORTHS FOOD", visitsCount: 8 },
      { id: "v7", storeName: "SHOPRITE", visitsCount: 15 },
    ],
  },
];
