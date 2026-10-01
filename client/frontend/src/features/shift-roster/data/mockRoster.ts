export interface PorterAssignment {
  id: number;
  name: string;
  status: "Active" | "Guard" | "Off Day";
  location: string;
}

export interface DailyRoster {
  day: string;
  morningWave: PorterAssignment[];
  reinforcements: PorterAssignment[];
  nightSweepers: PorterAssignment[];
  offToday: PorterAssignment[];
}

export const mockWeeklyRoster: DailyRoster[] = [
  {
    day: "Monday",
    morningWave: [
      { id: 1, name: "Sipho Nkomo", status: "Active", location: "★ GAME BAY" },
      {
        id: 2,
        name: "Blessed Dube",
        status: "Active",
        location: "DIS-CHEM BAY",
      },
      {
        id: 3,
        name: "Musa Ndlovu",
        status: "Guard",
        location: "Zone Break Cover",
      },
    ],
    reinforcements: [
      {
        id: 4,
        name: "Thabo Khumalo",
        status: "Active",
        location: "CLICKS PHARMACY",
      },
      {
        id: 5,
        name: "Lungelo Cele",
        status: "Active",
        location: "PARKING B DROP-OFF",
      },
      {
        id: 6,
        name: "Mandla Khoza",
        status: "Active",
        location: "PARKING A HUB",
      },
    ],
    nightSweepers: [
      {
        id: 7,
        name: "Sibusiso Zulu",
        status: "Active",
        location: "PARKING G CLEARANCE",
      },
      {
        id: 8,
        name: "Nkululeko Nxumalo",
        status: "Active",
        location: "PARKING E SWEER",
      },
      {
        id: 9,
        name: "Bandile Mthembu",
        status: "Active",
        location: "MAIN ENTRANCE BAYS",
      },
    ],
    offToday: [
      {
        id: 10,
        name: "Jabu Sithole",
        status: "Off Day",
        location: "Mandatory Rest",
      },
      {
        id: 11,
        name: "Kevin Naidoo",
        status: "Off Day",
        location: "Mandatory Rest",
      },
      {
        id: 12,
        name: "Thami Zondi",
        status: "Off Day",
        location: "Mandatory Rest",
      },
    ],
  },
  {
    day: "Tuesday",
    morningWave: [
      {
        id: 10,
        name: "Jabu Sithole",
        status: "Active",
        location: "★ GAME BAY",
      },
      {
        id: 11,
        name: "Kevin Naidoo",
        status: "Active",
        location: "DIS-CHEM BAY",
      },
      {
        id: 1,
        name: "Sipho Nkomo",
        status: "Guard",
        location: "Zone Break Cover",
      },
    ],
    reinforcements: [
      {
        id: 2,
        name: "Blessed Dube",
        status: "Active",
        location: "CLICKS PHARMACY",
      },
      {
        id: 3,
        name: "Musa Ndlovu",
        status: "Active",
        location: "PARKING B DROP-OFF",
      },
      {
        id: 12,
        name: "Thami Zondi",
        status: "Active",
        location: "PARKING A HUB",
      },
    ],
    nightSweepers: [
      {
        id: 4,
        name: "Thabo Khumalo",
        status: "Active",
        location: "PARKING G CLEARANCE",
      },
      {
        id: 5,
        name: "Lungelo Cele",
        status: "Active",
        location: "PARKING E SWEER",
      },
      {
        id: 6,
        name: "Mandla Khoza",
        status: "Active",
        location: "MAIN ENTRANCE BAYS",
      },
    ],
    offToday: [
      {
        id: 7,
        name: "Sibusiso Zulu",
        status: "Off Day",
        location: "Mandatory Rest",
      },
      {
        id: 8,
        name: "Nkululeko Nxumalo",
        status: "Off Day",
        location: "Mandatory Rest",
      },
      {
        id: 9,
        name: "Bandile Mthembu",
        status: "Off Day",
        location: "Mandatory Rest",
      },
    ],
  },
  // Remaining days of the week will naturally expand out inside this unified format!
];
