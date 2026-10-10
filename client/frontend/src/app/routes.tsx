import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import AcademyPage from "../features/academy/AcademyPage";
import FleetAuditPage from "../features/fleet-audit/FleetAuditPage";
import ShiftRosterPage from "../features/shift-roster/ShiftRosterPage";
import FixReportPage from "../features/fix-report/FixReportPage";
import LoginPage from "../features/auth/LoginPage";
// import ShiftAttendancePage from "../features/attendance/ShiftAttendancePage";
import ClerkDiagnosticsPage from "../features/auth/ClerkDiagnosticsPage";
import QuizDashboardPage from "../features/safety-quizzes/QuizDashboardPage";
import AttendancePage from "../features/attendance/AttendancePage";

// 🔓 THE ROUTE GUARD WRAPPER (DEACTIVATED)
// This is now an open gateway. It completely ignores Clerk status
// and passes the components straight into your layout framework.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <Layout>{children}</Layout>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/academy" replace />,
  },
  {
    path: "/quiz-test",
    element: (
      <ProtectedRoute>
        <QuizDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/academy",
    element: (
      <ProtectedRoute>
        <AcademyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/diagnostics",
    element: (
      <Layout>
        <ClerkDiagnosticsPage />
      </Layout>
    ),
  },
  {
    path: "/attendance",
    element: (
      <ProtectedRoute>
        <AttendancePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/fleet-audit",
    element: (
      <ProtectedRoute>
        <FleetAuditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/fix-report",
    element: (
      <ProtectedRoute>
        <FixReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/shift-log",
    element: (
      <ProtectedRoute>
        <ShiftRosterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
]);
