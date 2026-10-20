// 📂 File: src/features/manager-console/components/BranchLiveMonitor.tsx
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import { ArrowBackIos, Assessment, Storefront } from "@mui/icons-material";
import type { IAreaBranchResponse } from "../services/managerConsoleService";

// Feature-Driven Component Imports
import { OvernightAuditCard } from "./OvernightAuditCard";
import { StoreSweepsCard } from "./StoreSweepsCard";
import { FleetIntegrityCard } from "./FleetIntegrityCard";
import { ActivePersonnelMatrix } from "./ActivePersonnelMatrix";

interface BranchLiveMonitorProps {
  branchMeta: IAreaBranchResponse;
  liveData: any | null;
  isLoading: boolean;
  onBack: () => void;
  onNavigateToAnalytics: () => void;
}

export default function BranchLiveMonitor({
  branchMeta,
  liveData,
  isLoading,
  onBack,
  onNavigateToAnalytics,
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

  // 🚀 Extract our clean metrics, live personnel lists, and the dynamic stores array from the new packet
  const { metrics, livePorters, storeVisitsToday, stores = [] } = liveData;

  const lastUpdatedString = liveData.meta?.lastAuditLoggedAt
    ? new Date(liveData.meta.lastAuditLoggedAt).toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No macro audits logged yet";

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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 0.5,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "900", color: "#1e1b4b" }}>
          {branchMeta.name}
        </Typography>

        <Button
          variant="contained"
          startIcon={<Assessment />}
          onClick={onNavigateToAnalytics}
          sx={{
            bgcolor: "#4f46e5",
            fontWeight: "700",
            textTransform: "none",
            borderRadius: 2.5,
            "&:hover": { bgcolor: "#4338ca" },
          }}
        >
          Open Loss Analytics
        </Button>
      </Box>

      <Typography
        variant="caption"
        sx={{ color: "#64748b", display: "block", mb: 4, fontWeight: "600" }}
      >
        District Unit:{" "}
        <strong>{branchMeta.area?.name || "KZN District"}</strong> &bull; Hub
        routing code: <strong>{branchMeta.branchCode}</strong>
      </Typography>

      {/* ❶ SECTION A: GLOBAL BRANCH WIDE MATRIX OVERVIEW CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <OvernightAuditCard count={metrics.totalRegisteredFleet} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StoreSweepsCard storeVisits={storeVisitsToday} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FleetIntegrityCard
            status={{
              totalRegistered: metrics.totalRegisteredFleet,
              operational: metrics.operationalUsable,
              dirty: metrics.activeDirty,
              broken: metrics.activeBroken,
              lost: metrics.lostTrolleys || 0,
              efficiency: metrics.efficiencyRatePercentage,
              lastUpdated: lastUpdatedString,
            }}
          />
        </Grid>
      </Grid>

      {/* ❷ SECTION B: THE DYNAMIC STORE-BY-STORE DATA CARD BLOCKS LOOP */}
      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          fontWeight: "900",
          color: "#1e1b4b",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Storefront Fleet Breakdown Loops
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stores.map((store: any) => (
          <Grid key={store.storeId} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{ borderRadius: 3, borderColor: "#cbd5e1", height: "100%" }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Storefront sx={{ color: "#4f46e5", fontSize: 20 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "900", color: "#1e1b4b" }}
                  >
                    {store.storeName}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "baseline", mb: 2.5 }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "900", color: "#0f172a" }}
                  >
                    {store.metrics.totalRegisteredFleet}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "700", color: "text.secondary" }}
                  >
                    Total Fleet Units
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "600", color: "#475569" }}
                    >
                      🟢 Ready Operational
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "800", color: "#16a34a" }}
                    >
                      {store.metrics.operationalUsable} units
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#f1f5f9" }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "600", color: "#475569" }}
                    >
                      🔴 Damaged / Broken
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "800", color: "#dc2626" }}
                    >
                      {store.metrics.activeBroken} units
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#f1f5f9" }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "600", color: "#475569" }}
                    >
                      🟡 Soiled / Too Dirty
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "800", color: "#d97706" }}
                    >
                      {store.metrics.activeDirty} units
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ❸ SECTION C: PERSONNEL SHIFT PLACEMENTS */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ActivePersonnelMatrix livePorters={livePorters} />
        </Grid>
      </Grid>
    </Box>
  );
}
