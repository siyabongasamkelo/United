import { Box, Typography, Card, CardContent } from "@mui/material";
import ActiveQueueList from "./components/ActiveQueueList";
import ReportForm from "./components/ReportForm";

export default function FixReportPage() {
  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "800px", mx: "auto" }}>
      {/* ❶ PURPOSE EXPLANATION BLOCK */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "#e2e8f0",
          bgcolor: "#ffffff",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Fix Report & Asset Integrity Console
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            A damaged trolley fleet is a direct drain on company revenue.
            Logging flat wheel bearings, cracked base chassis frames, or frozen
            back-gates immediately isolates defective equipment from
            customer-facing lanes, preventing mall fines and keeping fleet
            operational speeds at their peak.
          </Typography>
        </CardContent>
      </Card>

      {/* ❷ LIVE QUEUE LIST SECTION (READ FIRST) */}
      <Box sx={{ mb: 5 }}>
        <ActiveQueueList />
      </Box>

      {/* ❸ ACTION LOGGER FORM BLOCK (WRITE SECOND) */}
      <Box>
        <ReportForm />
      </Box>
    </Box>
  );
}
