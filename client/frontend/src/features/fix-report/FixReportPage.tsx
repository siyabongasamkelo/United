import { Box, Typography, Card, CardContent } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import ActiveQueueList from "./components/ActiveQueueList";
import ReportForm from "./components/ReportForm";
import { FixReportService } from "./services/fixReportService";
import type { IFixReportResponse } from "./services/fixReportService";

export default function FixReportPage() {
  const [queue, setQueue] = useState<IFixReportResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Re-fetch the live queue indices safely from Atlas cloud on mutations
  const fetchLiveQueue = useCallback(async () => {
    try {
      setLoading(true);
      const data = await FixReportService.getActiveMaintenanceQueue();
      setQueue(data);
    } catch (err) {
      console.error("Failed syncing territory yard active logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveQueue();
  }, [fetchLiveQueue]);

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
          boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
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

      {/* ❷ LIVE WORKSHOP QUEUE TRACKER GRID */}
      <Box sx={{ mb: 5 }}>
        <ActiveQueueList queue={queue} loading={loading} />
      </Box>

      {/* ❸ ACTION LOGGER FORM BLOCK WITH REFRESH TRIGGER LOGIC */}
      <Box>
        <ReportForm onReportAdded={fetchLiveQueue} />
      </Box>
    </Box>
  );
}
