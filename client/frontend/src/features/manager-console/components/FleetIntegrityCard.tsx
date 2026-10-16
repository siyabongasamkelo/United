// 📂 File: src/features/manager-console/components/FleetIntegrityCard.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { BuildCircle, AccessTime } from "@mui/icons-material";

interface FleetStatus {
  totalRegistered: number;
  operational: number;
  dirty: number;
  broken: number;
  lastUpdated: string;
}

interface FleetIntegrityCardProps {
  status?: FleetStatus;
}

export function FleetIntegrityCard({ status }: FleetIntegrityCardProps) {
  const fleetInfo = status || {
    totalRegistered: 300,
    operational: 200,
    dirty: 50,
    broken: 50,
    lastUpdated: "Today, 09:45 AM",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <BuildCircle sx={{ color: "#f59e0b", fontSize: 20 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "900", color: "#1e1b4b" }}
            >
              Fleet Integrity Matrix
            </Typography>
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
                sx={{ fontWeight: "700", color: "#475569" }}
              >
                🟢 Ready / Operational
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
                🟡 Soiled / Wash Queue
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
                🔴 Broken / Repairs Detached
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "800", color: "#dc2626" }}
              >
                {fleetInfo.broken} units
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
            Last updated: {fleetInfo.lastUpdated}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
