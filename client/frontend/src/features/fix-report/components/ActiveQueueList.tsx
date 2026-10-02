import { Box, Typography, Card, CardContent, Stack, Chip } from "@mui/material";
import { mockDefectReports } from "../data/mockReports";

export default function ActiveQueueList() {
  return (
    <Box>
      <Typography
        sx={{
          mb: 2,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          variant: "subtitle2",
          color: "text.secondary",
          fontWeight: "800",
        }}
      >
        Active Maintenance Compound Queue
      </Typography>

      <Stack spacing={2}>
        {mockDefectReports.map((report) => (
          <Card
            key={report.id}
            variant="outlined"
            sx={{ borderRadius: 3, borderColor: "#e2e8f0" }}
          >
            <CardContent
              sx={{
                p: 2.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{ variant: "body2", fontWeight: "800", color: "#1e1b4b" }}
                >
                  ⚙️ {report.trolleyNumber} — {report.brokenPart}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  Belongs to: {report.storeOrigin}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Chip
                  label={`Severity: ${report.severity}`}
                  size="small"
                  color={report.severity === "High" ? "error" : "warning"}
                  variant="outlined"
                  sx={{ fontWeight: "700" }}
                />
                <Chip
                  label={report.status}
                  size="small"
                  sx={{
                    bgcolor: "#f1f5f9",
                    color: "#475569",
                    fontWeight: "700",
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
