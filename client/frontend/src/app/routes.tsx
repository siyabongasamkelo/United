import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import AcademyPage from "../features/academy/AcademyPage";
import FleetAuditPage from "../features/fleet-audit/FleetAuditPage";
import ShiftRosterPage from "../features/shift-roster/ShiftRosterPage";
import FixReportPage from "../features/fix-report/FixReportPage";
import LoginPage from "../features/auth/LoginPage";

// Remaining layout stubs for upcoming sprints

const FixReportPlaceholder = () => (
  <div style={{ padding: "24px" }}>Fix Report Layout coming soon.</div>
);
const BayRadarPlaceholder = () => (
  <div style={{ padding: "24px" }}>Bay Radar Layout coming soon.</div>
);

const LoginPagePlaceholder = () => (
  <div style={{ padding: "80px 20px", textAlign: "center" }}>
    <h3>[ Your Existing Login Page Content Dropped Here ]</h3>
  </div>
);

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
    path: "/bay-radar",
    element: (
      <Layout>
        <BayRadarPlaceholder />
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
