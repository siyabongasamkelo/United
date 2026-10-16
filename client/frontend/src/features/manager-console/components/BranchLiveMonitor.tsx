// 📂 File: src/features/manager-console/components/BranchLiveMonitor.tsx
import { Box, Typography, Button, CircularProgress, Grid } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import type { IAreaBranchResponse } from "../services/managerConsoleService";

// 🚀 Feature-Driven Isolated Imports
import { OvernightAuditCard } from "./OvernightAuditCard";
import { StoreSweepsCard } from "./StoreSweepsCard";
import { FleetIntegrityCard } from "./FleetIntegrityCard";
import { ActivePersonnelMatrix } from "./ActivePersonnelMatrix";

interface BranchLiveMonitorProps {
  branchMeta: IAreaBranchResponse;
  liveData: any | null;
  isLoading: boolean;
  onBack: () => void;
}

export default function BranchLiveMonitor({
  branchMeta,
  liveData,
  isLoading,
  onBack,
}: BranchLiveMonitorProps) {
  if (isLoading || !liveData) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 12,
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#4f46e5" }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "700" }}
        >
          Synchronizing Live Terminal Operational Matrix...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIos sx={{ fontSize: 14 }} />}
        onClick={onBack}
        sx={{
          color: "#64748b",
          fontWeight: "700",
          textTransform: "none",
          mb: 3,
        }}
      >
        Back to District List
      </Button>

      <Typography
        variant="h5"
        sx={{ fontWeight: "900", color: "#1e1b4b", mb: 0.5 }}
      >
        {branchMeta.name}
      </Typography>

      <Typography
        variant="caption"
        sx={{ color: "#64748b", display: "block", mb: 4, fontWeight: "600" }}
      >
        District Unit:{" "}
        <strong>{branchMeta.area?.name || "KZN District"}</strong> &bull; Hub
        routing code: <strong>{branchMeta.branchCode}</strong>
      </Typography>

      <Grid container spacing={3}>
        {/* ❶ BLOCK A: LATEST TROLLEY FLEET CAPTURED LAST NIGHT */}
        <Grid size={{ xs: 12, md: 4 }}>
          <OvernightAuditCard count={liveData.lastNightCount} />
        </Grid>

        {/* ❷ BLOCK B: LIVE RE-MAPPED ANCHOR STORE SWEEPS COUNTER */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StoreSweepsCard storeVisits={liveData.storeVisitsToday} />
        </Grid>

        {/* ❸ BLOCK C: REAL-TIME FLEET DEPLOYMENT & INTEGRITY STATUS */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FleetIntegrityCard status={liveData.fleetStatus} />
        </Grid>

        {/* ❹ BLOCK D: LIVE SEEDED PERSONNEL MATRIX */}
        <Grid size={{ xs: 12 }}>
          <ActivePersonnelMatrix livePorters={liveData.livePorters} />
        </Grid>
      </Grid>
    </Box>
  );
}
