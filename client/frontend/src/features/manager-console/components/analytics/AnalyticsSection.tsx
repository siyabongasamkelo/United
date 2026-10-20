import { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup, Grid } from "@mui/material";
import { FinancialLossCard } from "./FinancialLossCard";
import { OperationalEffortCard } from "./OperationalEffortCard";
import { TrendLineGraph } from "./TrendLineGraph";

interface AnalyticsSectionProps {
  metrics: { lostTrolleys: number; activeBroken: number };
  branchId: string;
}

export function AnalyticsSection({ metrics, branchId }: AnalyticsSectionProps) {
  const [timeUnit, setTimeUnit] = useState<"days" | "months">("days");

  // Simulated live trend packet mapping timeline coordinates
  const dummyTrendData = [
    { label: "Mon", lost: 4, broken: 8, effortKm: 58 },
    { label: "Tue", lost: 2, broken: 5, effortKm: 62 },
    { label: "Wed", lost: 7, broken: 12, effortKm: 65 },
    { label: "Thu", lost: 1, broken: 4, effortKm: 55 },
    { label: "Fri", lost: 6, broken: 9, effortKm: 70 },
  ];

  return (
    <Box sx={{ mt: 4, pt: 3, borderTop: "1px dashed #cbd5e1" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <ToggleButtonGroup
          value={timeUnit}
          exclusive
          onChange={(_, val) => val && setTimeUnit(val)}
          size="small"
        >
          <ToggleButton value="days" sx={{ fontWeight: "700" }}>
            Days
          </ToggleButton>
          <ToggleButton value="months" sx={{ fontWeight: "700" }}>
            Months
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FinancialLossCard
            lostCount={metrics.lostTrolleys}
            brokenCount={metrics.activeBroken}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <OperationalEffortCard lostCount={metrics.lostTrolleys} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TrendLineGraph data={dummyTrendData} />
        </Grid>
      </Grid>
    </Box>
  );
}
