// 📂 File: src/features/manager-console/components/BranchLiveMonitor.tsx (PART 1)
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ArrowBackIos,
  Assessment,
  Storefront,
  Speed,
  Equalizer,
  Groups,
} from "@mui/icons-material";
import type { IAreaBranchResponse } from "../services/managerConsoleService";

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

  const {
    metrics,
    livePorters,
    storeVisitsToday,
    stores = [],
    porterPerformanceRankings = [],
  } = liveData;

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

      {/* TOP KPI OVERVIEW CARDS */}
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

      {/* STOREFRONT FLEET STACK BREAKDOWN GRIDS */}
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

      <Grid container spacing={3} sx={{ mb: 5 }}>
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

      {/* BOTTOM ACCOUNTABILITY CONTROL PANELS GRID */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Groups sx={{ color: "#1e1b4b", fontSize: 20 }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "900",
                color: "#1e1b4b",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Active Placement Roster
            </Typography>
          </Box>
          <ActivePersonnelMatrix livePorters={livePorters} />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Equalizer sx={{ color: "#1e1b4b", fontSize: 20 }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "900",
                color: "#1e1b4b",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Floor Sweep Velocity Leaderboard
            </Typography>
          </Box>
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, borderColor: "#cbd5e1", bgcolor: "#ffffff" }}
          >
            <CardContent sx={{ p: 2.5 }}>
              {porterPerformanceRankings.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4, fontWeight: "600" }}
                >
                  No QR sweep data recorded for today.
                </Typography>
              ) : (
                <List dense disablePadding>
                  {porterPerformanceRankings.map((rank: any, index: number) => {
                    const isLazy = rank.totalScansToday < 10;
                    return (
                      <ListItem
                        key={rank.porterId}
                        divider={index !== porterPerformanceRankings.length - 1}
                        sx={{
                          py: 1.5,
                          px: 1,
                          borderRadius: 2,
                          mb: 0.5,
                          bgcolor: isLazy ? "#fff1f2" : "transparent",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 32,
                            fontWeight: "900",
                            color: index === 0 ? "#d97706" : "#64748b",
                          }}
                        >
                          #{index + 1}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "800", color: "#0f172a" }}
                            >
                              {rank.fullName}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b", fontWeight: "600" }}
                            >
                              Last active:{" "}
                              {new Date(
                                rank.lastScanLoggedAt,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          }
                        />
                        <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: "900",
                              color: isLazy ? "#dc2626" : "#4f46e5",
                            }}
                          >
                            {rank.totalScansToday} Scans
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ alignItems: "center" }}
                          >
                            <Speed
                              sx={{
                                fontSize: 12,
                                color: isLazy ? "#ef4444" : "#16a34a",
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: "700",
                                color: isLazy ? "#ef4444" : "#16a34a",
                              }}
                            >
                              {rank.scansPerHour}/hr speed
                            </Typography>
                          </Stack>
                        </Stack>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
