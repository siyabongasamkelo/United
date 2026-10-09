import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Link,
} from "@mui/material";
import { InsertPhoto } from "@mui/icons-material";
import type { IFixReportResponse } from "../services/fixReportService";

interface ActiveQueueListProps {
  queue: IFixReportResponse[];
  loading: boolean;
}

export default function ActiveQueueList({
  queue,
  loading,
}: ActiveQueueListProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 4,
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <CircularProgress size={20} sx={{ color: "#1e1b4b" }} />
        <Typography variant="body2" color="text.secondary">
          Syncing structural repair registers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          color: "text.secondary",
          fontWeight: "800",
          letterSpacing: 0.5,
        }}
      >
        Active Maintenance Compound Queue ({queue.length})
      </Typography>

      {queue.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ py: 2, px: 0.5 }}
        >
          ✅ All fleet metrics clear. No defective equipment currently logged in
          the workshop.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {queue.map((report) => (
            <Card
              key={report._id}
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: "#e2e8f0",
                bgcolor: "#ffffff",
              }}
            >
              <CardContent
                sx={{
                  p: 2.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: "1 1 60%" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "800", color: "#1e1b4b" }}
                  >
                    ⚙️ {report.trolleyId} —{" "}
                    {report.brokenComponent.replace("_", " ")}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5, fontWeight: "600" }}
                  >
                    Store Origin:{" "}
                    {report.storeOrigin?.storeName || "Unknown Store"} &bull;
                    Reported By: {report.reportedBy?.firstName}{" "}
                    {report.reportedBy?.lastName}
                  </Typography>
                  {report.notes && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 1,
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: "#f8fafc",
                        borderLeft: "2.5px solid #cbd5e1",
                        color: "#475569",
                        fontStyle: "italic",
                      }}
                    >
                      "{report.notes}"
                    </Typography>
                  )}
                  {report.evidenceImageUrl && (
                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <InsertPhoto sx={{ color: "#4f46e5", fontSize: 16 }} />
                      <Link
                        href={report.evidenceImageUrl}
                        target="_blank"
                        rel="noopener"
                        variant="caption"
                        sx={{
                          fontWeight: "700",
                          color: "#4f46e5",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        View Uploaded Image Proof
                      </Link>
                    </Box>
                  )}
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Chip
                    label={`Severity: ${report.damageSeverity}`}
                    size="small"
                    color={
                      report.damageSeverity === "HIGH"
                        ? "error"
                        : report.damageSeverity === "MEDIUM"
                          ? "warning"
                          : "default"
                    }
                    variant="outlined"
                    sx={{
                      fontWeight: "700",
                      fontSize: "0.7rem",
                      borderRadius: 1.5,
                    }}
                  />
                  <Chip
                    label={report.maintenanceStatus.replace("_", " ")}
                    size="small"
                    sx={{
                      bgcolor:
                        report.maintenanceStatus === "PENDING_REPAIR"
                          ? "#fee2e2"
                          : "#f1f5f9",
                      color:
                        report.maintenanceStatus === "PENDING_REPAIR"
                          ? "#ef4444"
                          : "#475569",
                      fontWeight: "800",
                      fontSize: "0.7rem",
                      borderRadius: 1.5,
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
