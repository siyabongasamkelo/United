// 📂 File: src/features/manager-console/components/FleetIntegrityCard.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { BuildCircle, AccessTime, Autorenew } from "@mui/icons-material";

interface FleetStatus {
  totalRegistered: number;
  operational: number;
  dirty: number;
  broken: number;
  lost: number; // 🚀 Added to types configuration context
  efficiency: number; // 🚀 Added to track efficiency percentage
  lastUpdated: string;
}

interface FleetIntegrityCardProps {
  status?: FleetStatus;
}

export function FleetIntegrityCard({ status }: FleetIntegrityCardProps) {
  const fleetInfo = status || {
    totalRegistered: 0,
    operational: 0,
    dirty: 0,
    broken: 0,
    lost: 0,
    efficiency: 0,
    lastUpdated: "Not available",
  };

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: "#cbd5e1", height: "100%" }}
    >
      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BuildCircle sx={{ color: "#f59e0b", fontSize: 20 }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "900", color: "#1e1b4b" }}
              >
                Fleet Integrity Matrix
              </Typography>
            </Box>

            {/* 🚀 EFFICIENCY CHIP PLACEMENT */}
            <Chip
              icon={
                <Autorenew
                  sx={{
                    fontSize: "14px !important",
                    color: "#4f46e5 !important",
                  }}
                />
              }
              label={`${fleetInfo.efficiency}% Efficiency Rate`}
              sx={{
                bgcolor: "#eeebff",
                color: "#4f46e5",
                fontWeight: "800",
                borderRadius: 2,
              }}
            />
          </Box>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "baseline", mt: 1, mb: 2 }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "900", color: "#0f172a" }}
            >
              {fleetInfo.totalRegistered}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: "700", color: "text.secondary" }}
            >
              Total Active Stock Units
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Box
              sx={{
                display: "flex",
                justifyGroup: "space-between",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "700", color: "#475569" }}
              >
                🟢 Ready / Usable Operational Fleet
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "800", color: "#16a34a" }}
              >
                {fleetInfo.operational} units
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
                sx={{ fontWeight: "700", color: "#475569" }}
              >
                🟡 Soiled / Wash Queue Active
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "800", color: "#d97706" }}
              >
                {fleetInfo.dirty} units
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
                sx={{ fontWeight: "700", color: "#475569" }}
              >
                🔴 Damaged / Repairs Detached
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "800", color: "#dc2626" }}
              >
                {fleetInfo.broken} units
              </Typography>
            </Box>

            {/* 🚀 NEW VARIANCE FIELD ADDED HERE FOR THE LOST UNITS ROW */}
            <Divider sx={{ borderColor: "#f1f5f9" }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#fff1f2",
                p: 1,
                borderRadius: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "700", color: "#991b1b" }}
              >
                ⚠️ Missing / Lost Variance Delta
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "900", color: "#e11d48" }}
              >
                {fleetInfo.lost} units
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 3,
            pt: 1,
            borderTop: "1px dashed #e2e8f0",
          }}
        >
          <AccessTime sx={{ color: "#94a3b8", fontSize: 14 }} />
          <Typography
            variant="caption"
            sx={{ color: "#64748b", fontWeight: "600" }}
          >
            Last Live Compute Sync: {fleetInfo.lastUpdated}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
