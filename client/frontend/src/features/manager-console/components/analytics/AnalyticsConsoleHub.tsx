// 📂 File: src/features/manager-console/components/analytics/AnalyticsConsoleHub.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
} from "@mui/material";
import { ArrowBackIos, Assessment } from "@mui/icons-material";
import type { IAreaBranchResponse } from "../../services/managerConsoleService";
import { FinancialLossCard } from "./FinancialLossCard";
// import { OperationalEffortCard } from "./OperationalEffortCard";
import { TrendLineGraph } from "./TrendLineGraph";

interface AnalyticsConsoleHubProps {
  branchMeta: IAreaBranchResponse;
  liveData: any;
  onBack: () => void;
}

export function AnalyticsConsoleHub({
  branchMeta,
  liveData,
  onBack,
}: AnalyticsConsoleHubProps) {
  const [timeScale, setTimeScale] = useState<"days" | "months">("days");

  const metrics = liveData?.metrics || { lostTrolleys: 0, activeBroken: 0 };

  // Seed baseline data points for chart tracking
  const historicTimelineData = [
    { label: "Mon", lost: 3, broken: 5 },
    { label: "Tue", lost: 5, broken: 8 },
    { label: "Wed", lost: 12, broken: 14 },
    { label: "Thu", lost: 2, broken: 4 },
    { label: "Fri", lost: 8, broken: 9 },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackIos sx={{ fontSize: 14 }} />}
          onClick={onBack}
          sx={{ color: "#64748b", fontWeight: "700", textTransform: "none" }}
        >
          Back to Live Terminal
        </Button>

        <ToggleButtonGroup
          value={timeScale}
          exclusive
          onChange={(_, val) => val && setTimeScale(val)}
          size="small"
        >
          <ToggleButton value="days" sx={{ fontWeight: "700", px: 2 }}>
            Days
          </ToggleButton>
          <ToggleButton value="months" sx={{ fontWeight: "700", px: 2 }}>
            Months
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Assessment sx={{ color: "#4f46e5", fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "900", color: "#1e1b4b" }}>
            {branchMeta.name} &mdash; Predictive Loss Analytics
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#64748b", fontWeight: "600" }}
          >
            Strategic insights tracking operational drift over dynamic{" "}
            <strong>{timeScale}</strong> boundaries.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FinancialLossCard
            lostCount={metrics.lostTrolleys}
            brokenCount={metrics.activeBroken}
          />
        </Grid>
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <OperationalEffortCard lostCount={metrics.lostTrolleys} />
        </Grid> */}
        <Grid size={{ xs: 12 }}>
          <TrendLineGraph data={historicTimelineData} timeScale={timeScale} />
        </Grid>
      </Grid>
    </Box>
  );
}
