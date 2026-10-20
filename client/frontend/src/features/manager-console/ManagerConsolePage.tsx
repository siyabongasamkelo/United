// 📂 File: src/features/manager-console/ManagerConsolePage.tsx
import { useState } from "react";
import { Box, Typography, CircularProgress, Alert, Grid } from "@mui/material";
import { useManagerConsole } from "./hooks/useManagerConsole";
import { ProvincialIntroBanner } from "./components/ProvincialIntroBanner";
import { TerritoryCard } from "./components/TerritoryCard";
import BranchLiveMonitor from "./components/BranchLiveMonitor";
import { AnalyticsConsoleHub } from "./components/analytics/AnalyticsConsoleHub"; // 🚀 Ensure this is imported!

// ❶ Define our rigid explicit string route boundaries
type ActiveView = "LIST" | "MONITOR" | "ANALYTICS";

export default function ManagerConsolePage() {
  const {
    branches,
    isLoading,
    error,
    selectedBranch,
    setSelectedBranch,
    liveBranchSummary,
    isLoadingSummary,
    loadBranchDetailedSummary,
    clearSelectedBranch,
  } = useManagerConsole();

  // ❷ Wire up the local view state router
  const [currentView, setCurrentView] = useState<ActiveView>("LIST");

  const handleSelectBranch = (branchItem: any) => {
    setSelectedBranch(branchItem);
    setCurrentView("MONITOR");
    loadBranchDetailedSummary(branchItem._id);
  };

  const handleBackToList = () => {
    clearSelectedBranch();
    setCurrentView("LIST");
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: "480px", md: "1200px" },
        mx: "auto",
      }}
    >
      {/* 🔮 STATE GRID A: flagship district inventory index */}
      {currentView === "LIST" && (
        <Box>
          <ProvincialIntroBanner />

          <Typography
            variant="subtitle2"
            sx={{
              mb: 2.5,
              px: 0.5,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontSize: "0.75rem",
              color: "text.secondary",
              fontWeight: "800",
            }}
          >
            Contracted Field Infrastructure Territories
          </Typography>

          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#4f46e5" }} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {!isLoading && !error && (
            <Grid container spacing={3}>
              {branches.map((branchItem) => (
                <Grid key={branchItem._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <TerritoryCard
                    branch={branchItem}
                    onClick={() => handleSelectBranch(branchItem)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* 🔮 STATE GRID B: live operational tracking array console desk */}
      {currentView === "MONITOR" && selectedBranch && (
        <BranchLiveMonitor
          branchMeta={selectedBranch}
          liveData={liveBranchSummary}
          isLoading={isLoadingSummary}
          onBack={handleBackToList}
          // ❸ Handing down the navigation trigger cleanly right here!
          onNavigateToAnalytics={() => setCurrentView("ANALYTICS")}
        />
      )}

      {/* 🔮 STATE GRID C: deep performance metrics loss analytics deck */}
      {currentView === "ANALYTICS" && selectedBranch && (
        <AnalyticsConsoleHub
          branchMeta={selectedBranch}
          liveData={liveBranchSummary}
          onBack={() => setCurrentView("MONITOR")} // Drops back to the monitor block safely
        />
      )}
    </Box>
  );
}
