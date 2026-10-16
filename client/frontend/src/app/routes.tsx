import { createBrowserRouter, Navigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react"; // 🎯 Using your proven raw clerk engine hook directly
import Layout from "../components/Layout";
import AcademyPage from "../features/academy/AcademyPage";
import FleetAuditPage from "../features/fleet-audit/FleetAuditPage";
import ShiftRosterPage from "../features/shift-roster/ShiftRosterPage";
import FixReportPage from "../features/fix-report/FixReportPage";
import LoginPage from "../features/auth/LoginPage";
import ClerkDiagnosticsPage from "../features/auth/ClerkDiagnosticsPage";
import QuizDashboardPage from "../features/safety-quizzes/QuizDashboardPage";
import AttendancePage from "../features/attendance/AttendancePage";
import ManagerConsolePage from "../features/manager-console/ManagerConsolePage";
import StoreScanPage from "../features/store-visits/StoreScanPage";

/**
 * 🛡️ THE SECURE ROUTE GUARD (For Internal Workspace Pages)
 * Matches the layout pattern: if session and user ID are missing, boot them to login.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const clerk = useClerk(); // 🔍 Direct access to the low-level session keys

  const isOperatorLoggedIn = !!clerk.session && !!clerk.user?.id; // 🎯 Your working logic match

  if (!isOperatorLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

/**
 * 🔓 THE REVERSE AUTH GUARD (For the Login Page Only)
 * Prevents logged-in users from getting trapped on the login screen.
 */
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const clerk = useClerk();

  const isOperatorLoggedIn = !!clerk.session && !!clerk.user?.id;

  if (isOperatorLoggedIn) {
    return <Navigate to="/academy" replace />;
  }

  return <>{children}</>;
};

/**
 * 💡 DYNAMIC HOME PATH INTERCEPTOR
 * Resolves root layout endpoint navigation conditionally using your proven layout flags.
 */
const RootRedirect = () => {
  const clerk = useClerk();

  const isOperatorLoggedIn = !!clerk.session && !!clerk.user?.id;

  return isOperatorLoggedIn ? (
    <Navigate to="/academy" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
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
    path: "/store-visits",
    element: (
      <ProtectedRoute>
        <StoreScanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/branch-operations",
    element: (
      <ProtectedRoute>
        <ManagerConsolePage />
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
      <PublicOnlyRoute>
        <Layout>
          <LoginPage />
        </Layout>
      </PublicOnlyRoute>
    ),
  },
]);
