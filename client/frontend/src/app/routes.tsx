import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import AcademyPage from "../features/academy/AcademyPage"; // 💡 IMPORTS THE NEW PAGE

// Placeholders for remaining feature modules to tackle later
const BayRadarPlaceholder = () => (
  <div style={{ padding: "24px" }}>Bay Radar Layout coming soon.</div>
);
const ShiftLogPlaceholder = () => (
  <div style={{ padding: "24px" }}>Shift Log Layout coming soon.</div>
);
const FixReportPlaceholder = () => (
  <div style={{ padding: "24px" }}>Fix Report Layout coming soon.</div>
);
const PaceSetterPlaceholder = () => (
  <div style={{ padding: "24px" }}>Pace Setter Layout coming soon.</div>
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
        <AcademyPage /> {/* 💡 NO LONGER A STRIPPED PLACEHOLDER! */}
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
    path: "/shift-log",
    element: (
      <Layout>
        <ShiftLogPlaceholder />
      </Layout>
    ),
  },
  {
    path: "/fix-report",
    element: (
      <Layout>
        <FixReportPlaceholder />
      </Layout>
    ),
  },
  {
    path: "/pace-setter",
    element: (
      <Layout>
        <PaceSetterPlaceholder />
      </Layout>
    ),
  },
]);
