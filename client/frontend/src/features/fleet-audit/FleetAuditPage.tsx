import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import StoreAuditCard from "./components/StoreAuditCard";
import { mockStoreAudits } from "./data/mockAudits";
import AuditLogForm from "./components/AuditLogForm"; // 💡 Kept separate and clean

export default function FleetAuditPage() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: "480px", md: "1200px" },
        mx: "auto",
      }}
    >
      {/* ❶ THE MANAGEMENT PURPOSE INTRODUCTION CARD */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "#e2e8f0",
          bgcolor: "#ffffff",
          mb: 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Fleet Audit & Operational Intelligence
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            This board is not built to create extra paperwork or to serve as a
            mechanism for punishment. We log our physical trolley counts twice a
            day for a highly strategic purpose:{" "}
            <strong>to capture bulletproof operational data</strong>.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            By maintaining a live, accurate tally of our assets, we can identify
            exact loss trends—such as major equipment drops during month-end
            pressure zones or high-volume promotional specials. This enables us
            to launch precision operational responses exactly where they are
            needed.
          </Typography>
        </CardContent>
      </Card>

      {/* ❷ DYNAMIC LOOP DISPLAY CARDS (NOW SITTING FRONT & CENTER!) */}
      <Box sx={{ mb: 5 }}>
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
          Territory Active Audits
        </Typography>

        <Grid container spacing={3}>
          {mockStoreAudits.map((storeData) => (
            <Grid key={storeData.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <StoreAuditCard audit={storeData} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ❸ THE SUPERVISOR INTERACTIVE ENTRY INPUT CONSOLE (CLEANLY ACCESSIBLE AT THE BOTTOM) */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            px: 0.5,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: "0.75rem",
            color: "text.secondary",
            fontWeight: "800",
          }}
        >
          Shift Logging Console
        </Typography>
        <AuditLogForm />
      </Box>
    </Box>
  );
}
