// 📂 File: src/features/manager-console/components/ProvincialIntroBanner.tsx
import { Card, CardContent, Box, Typography } from "@mui/material";
import { Layers } from "@mui/icons-material";

export function ProvincialIntroBanner() {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: "#cbd5e1",
        bgcolor: "#ffffff",
        mb: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Layers sx={{ color: "#4f46e5", fontSize: 24 }} />
          <Typography variant="h5" sx={{ fontWeight: "900", color: "#1e1b4b" }}>
            Provincial Operations Console
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          Welcome back, District Director. This control desk interfaces with
          field routers across contracted territories. Select a flagship branch
          installation below to access live terminal deployment logs, physical
          balance audits, and real-time communication bridges.
        </Typography>
      </CardContent>
    </Card>
  );
}
