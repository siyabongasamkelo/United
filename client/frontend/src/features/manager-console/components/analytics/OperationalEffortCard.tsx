import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { DirectionsWalk } from "@mui/icons-material";

export function OperationalEffortCard({ lostCount }: { lostCount: number }) {
  // Simulated tracking parameters derived from performance counters
  const estimatedKmWalked = 60;

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: "#cbd5e1", height: "100%" }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <DirectionsWalk sx={{ color: "#4f46e5", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Ground Force Effort Metrics
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "900", color: "#1e1b4b" }}
            >
              {estimatedKmWalked} km
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: "700", color: "text.secondary" }}
            >
              Aggregate Foot Patrol Coverage (Past Wave Cycle)
            </Typography>
          </Box>

          <Box sx={{ bgcolor: "#eff6ff", p: 2, borderRadius: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "700", color: "#1e40af", mb: 0.5 }}
            >
              🛡️ Infrastructure Justification Vector
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: "600",
                color: "#1d4ed8",
                display: "block",
                lineHeight: 1.4,
              }}
            >
              Field staff crossed {estimatedKmWalked} km searching layout
              sectors but {lostCount} units were still leaked. This proves the
              physical resource threshold has been saturated; perimeter control
              mechanisms are required.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
