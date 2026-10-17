import { createBrowserRouter, Navigate } from "react-router-dom";
import { useUser } from "../features/users/context/UserContext"; // 🎯 Using your custom profile engine!
import { Box, CircularProgress } from "@mui/material";
// import Layout from "../components/Layout";
import { Layout } from "../components/Layout"; // 💡 FIX: Wrapped in curly braces to match your named export layout

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
import SupervisorConsolePage from "../features/supervisor-console/SupervisorConsolePage";

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<
    "PORTER" | "SUPERVISOR" | "AREA_MANAGER" | "SYSTEM_ADMIN"
  >;
}

/**
 * 🛡️ THE SECURE ROLE GUARD
 * Safeguards internal paths by verifying the local database profile role context
 */
const ProtectedRoute = ({ children, allowedRoles }: GuardProps) => {
  const { currentUser, isLoadingProfile } = useUser(); //

  // ⏳ 1. If your database profile fetch is running, show a full-screen loading state
  if (isLoadingProfile) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#4f46e5" }} />
      </Box>
    );
  }

  // 🛑 2. If no MongoDB record was populated, reject and redirect to Login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 🚨 3. If a restriction list exists and the user's role doesn't have authorization, bounce them to their dashboard
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (
      currentUser.role === "AREA_MANAGER" ||
      currentUser.role === "SYSTEM_ADMIN"
    ) {
      return <Navigate to="/area-operations" replace />;
    }
    if (currentUser.role === "SUPERVISOR") {
      return <Navigate to="/branch-operations" replace />;
    }
    return <Navigate to="/academy" replace />;
  }

  return <Layout>{children}</Layout>;
};

/**
 * 🔓 THE REVERSE AUTH GUARD
 */
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useUser(); //

  if (currentUser) {
    if (
      currentUser.role === "AREA_MANAGER" ||
      currentUser.role === "SYSTEM_ADMIN"
    )
      return <Navigate to="/area-operations" replace />;
    if (currentUser.role === "SUPERVISOR")
      return <Navigate to="/branch-operations" replace />;
    return <Navigate to="/academy" replace />;
  }

  return <>{children}</>;
};

/**
 * 💡 DYNAMIC HOME PATH INTERCEPTOR
 * Reads your user profiles directly and routes people to their precise workplace deck on entry
 */
const RootRedirect = () => {
  const { currentUser, isLoadingProfile } = useUser(); //

  if (isLoadingProfile) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#4f46e5" }} />
      </Box>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  if (
    currentUser.role === "AREA_MANAGER" ||
    currentUser.role === "SYSTEM_ADMIN"
  ) {
    return <Navigate to="/area-operations" replace />;
  }
  if (currentUser.role === "SUPERVISOR") {
    return <Navigate to="/branch-operations" replace />;
  }
  return <Navigate to="/academy" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/branch-operations",
    element: (
      <ProtectedRoute allowedRoles={["SUPERVISOR", "SYSTEM_ADMIN"]}>
        <SupervisorConsolePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/area-operations",
    element: (
      <ProtectedRoute allowedRoles={["AREA_MANAGER", "SYSTEM_ADMIN"]}>
        <ManagerConsolePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quiz-test",
    element: (
      <ProtectedRoute allowedRoles={["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"]}>
        <QuizDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/store-visits",
    element: (
      <ProtectedRoute allowedRoles={["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"]}>
        <StoreScanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/academy",
    element: (
      <ProtectedRoute
        allowedRoles={["PORTER", "SUPERVISOR", "AREA_MANAGER", "SYSTEM_ADMIN"]}
      >
        <AcademyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/attendance",
    element: (
      <ProtectedRoute allowedRoles={["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"]}>
        <AttendancePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/fleet-audit",
    element: (
      <ProtectedRoute
        allowedRoles={["SUPERVISOR", "AREA_MANAGER", "SYSTEM_ADMIN"]}
      >
        <FleetAuditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/fix-report",
    element: (
      <ProtectedRoute allowedRoles={["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"]}>
        <FixReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/shift-log",
    element: (
      <ProtectedRoute allowedRoles={["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"]}>
        <ShiftRosterPage />
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
