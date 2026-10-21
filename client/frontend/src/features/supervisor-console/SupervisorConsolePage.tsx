import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useSupervisorConsole } from "./hooks/useSupervisorConsole";
import BranchLiveMonitor from "../manager-console/components/BranchLiveMonitor";

export default function SupervisorConsolePage() {
  const { branchMeta, liveData, isLoading, error, refreshDashboard } =
    useSupervisorConsole();

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: "480px", md: "1200px" },
        mx: "auto",
      }}
    >
      {/* 🚀 SUPERVISOR DESK CONTROL HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "900", color: "#1e1b4b" }}>
            Branch Supervisor Operations Desk
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time device operational balances, deployment queues, and floor
            matrices for your hub installation context.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshDashboard}
          sx={{
            borderColor: "#cbd5e1",
            color: "#1e1b4b",
            fontWeight: "700",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Refresh Live Feeds
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Render the standard operational dashboards seamlessly if ready */}
      {branchMeta && (
        <Box sx={{ "& button": { display: "none" } }}>
          {/* 💡 CSS Override note: Hides the "Back to District List" button seamlessly inside this view context */}
          <BranchLiveMonitor
            branchMeta={branchMeta}
            liveData={liveData}
            isLoading={isLoading}
            onBack={() => {}} // No-op: Back navigation is disabled for local branch context supervisors
            onNavigateToAnalytics={() => {}} // ◄ FIX: Satisfies the strict required TypeScript prop check!
          />
        </Box>
      )}

      {isLoading && !liveData && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#4f46e5" }} />
        </Box>
      )}
    </Box>
  );
}
