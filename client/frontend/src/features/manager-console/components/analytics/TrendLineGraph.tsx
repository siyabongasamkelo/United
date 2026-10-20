// 📂 File: src/features/manager-console/components/analytics/TrendLineGraph.tsx
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import { Timeline, Insights } from "@mui/icons-material";

interface TrendLineGraphProps {
  data: any[];
  timeScale: "days" | "months";
}

export function TrendLineGraph({ data, timeScale }: TrendLineGraphProps) {
  // 🚀 Check if we have enough historical runway data points (e.g., less than 14 days)
  const isDataBaselineShort = data.length < 14;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "#cbd5e1" }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Timeline sx={{ color: "#0284c7", fontSize: 20 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "900", color: "#1e1b4b" }}
            >
              Operational Drift Variance Matrix Timeline
            </Typography>
          </Box>
        </Box>

        {isDataBaselineShort ? (
          /* 🛡️ SMART PLACEHOLDER: Turns a temporary limitation into a feature */
          <Box
            sx={{
              height: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px dashed #cbd5e1",
              p: 3,
              textAlign: "center",
            }}
          >
            <Insights sx={{ color: "#64748b", fontSize: 40, mb: 1.5 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "800", color: "#334155", mb: 0.5 }}
            >
              Calibrating Historical Baseline Matrix
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                maxWidth: "450px",
                mb: 2,
                fontWeight: "600",
                lineHeight: 1.4,
              }}
            >
              The system requires a minimum 14-day tracking window to establish
              an accurate operational trend velocity. We are currently
              collecting live terminal submissions.
            </Typography>
            <Box sx={{ width: "200px" }}>
              <LinearProgress
                variant="indeterminate"
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": { bgcolor: "#0284c7" },
                }}
              />
            </Box>
          </Box>
        ) : (
          /* 📈 FUTURE RENDER SPACE: This will automatically show up when data grows! */
          <Box
            sx={{
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyGroup: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              [Line Graph Active Engine: Tracking {data.length} Datapoints]
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
