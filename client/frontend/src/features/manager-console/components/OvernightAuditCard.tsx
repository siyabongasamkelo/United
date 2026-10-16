// 📂 File: src/features/manager-console/components/OvernightAuditCard.tsx
import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import { AssignmentTurnedIn } from "@mui/icons-material";

interface OvernightAuditCardProps {
  count: number;
}

export function OvernightAuditCard({ count }: OvernightAuditCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: "#cbd5e1", height: "100%" }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AssignmentTurnedIn sx={{ color: "#4f46e5", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Overnight Balance Audit
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "baseline", mt: 2 }}
        >
          <Typography variant="h3" sx={{ fontWeight: "900", color: "#0f172a" }}>
            {count || 0}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: "700", color: "text.secondary" }}
          >
            Trolleys Accounted
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            display: "block",
            mt: 2,
            fontWeight: "500",
            lineHeight: 1.4,
          }}
        >
          Reflects the official physical inventory stock-take captured at the
          close of last night's shift wave.
        </Typography>
      </CardContent>
    </Card>
  );
}
