// 📂 File: src/features/manager-console/ManagerConsolePage.tsx
import { Box, Typography, CircularProgress, Alert, Grid } from "@mui/material";
// import Grid from "@mui/material/Grid2";
import { useManagerConsole } from "./hooks/useManagerConsole";
import { ProvincialIntroBanner } from "./components/ProvincialIntroBanner";
import { TerritoryCard } from "./components/TerritoryCard";
import BranchLiveMonitor from "./components/BranchLiveMonitor";

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

  // console.log("live branch summary", liveBranchSummary);
  // console.log("branches", branches);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: "480px", md: "1200px" },
        mx: "auto",
      }}
    >
      {/* 🚀 SCREEN STATE VIEW ROUTER */}
      {selectedBranch ? (
        <BranchLiveMonitor
          branchMeta={selectedBranch}
          liveData={liveBranchSummary}
          isLoading={isLoadingSummary}
          onBack={clearSelectedBranch}
        />
      ) : (
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
                    onClick={() => {
                      // ❶ Set metadata state node
                      setSelectedBranch(branchItem);
                      // ❷ Instantly dispatch live cross-talk database metrics load request
                      loadBranchDetailedSummary(branchItem._id);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
}
