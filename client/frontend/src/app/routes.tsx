import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import AcademyPage from "../features/academy/AcademyPage";
import FleetAuditPage from "../features/fleet-audit/FleetAuditPage";
import ShiftRosterPage from "../features/shift-roster/ShiftRosterPage";
import FixReportPage from "../features/fix-report/FixReportPage";
import LoginPage from "../features/auth/LoginPage";
import ShiftAttendancePage from "../features/attendance/ShiftAttendancePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/academy" replace />,
  },
  {
    path: "/academy",
    element: (
      <Layout>
        <AcademyPage />
      </Layout>
    ),
  },
  {
    path: "/attendance",
    element: (
      <Layout>
        <ShiftAttendancePage />
      </Layout>
    ),
  },
  {
    path: "/fleet-audit", // 💡 ASSIGNED TO THE CORRECT HEADER ROUTE LINK
    element: (
      <Layout>
        <FleetAuditPage /> {/* 💡 ACTIVE FULL SKELETON */}
      </Layout>
    ),
  },

  {
    path: "/fix-report",
    element: (
      <Layout>
        <FixReportPage /> {/* 💡 ACTIVE DYNAMIC MODULE */}
      </Layout>
    ),
  },

  {
    path: "/shift-log", // Matches the header menu route link property
    element: (
      <Layout>
        <ShiftRosterPage /> {/* 💡 ACTIVE FULL FEATURES BLUEPRINT */}
      </Layout>
    ),
  },
  {
    path: "/login", // 💡 NEW EXPLICIT ROUTE FOR YOUR AUTHENTICATION LAYER
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
]);
