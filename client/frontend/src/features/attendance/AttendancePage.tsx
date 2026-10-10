import { Box, Typography, Card, CardContent } from "@mui/material";
import AttendanceConsole from "./components/AttendanceConsole";

export default function AttendancePage() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: "480px", md: "1200px" },
        mx: "auto",
      }}
    >
      {/* ❶ COMPLIANCE & LEGAL NOTICE BRIEF */}
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
            Shift Validation & Geofence Activation
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            In compliance with operational standards and the{" "}
            <strong>OHS Act 85 of 1993</strong>, all floor operators must log
            their shift activation metrics prior to entering the floor layout
            lanes.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Your device will execute a high-accuracy spatial GPS sweep to
            confirm your proximity to the target terminal perimeter. Ensure all
            required physical safety gear is fully equipped before submitting
            confirmation logs.
          </Typography>
        </CardContent>
      </Card>

      {/* ❷ THE INTERACTIVE ATTENDANCE INTERFACE CONSOLE */}
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
          Shift Terminal Logging
        </Typography>
        <AttendanceConsole />
      </Box>
    </Box>
  );
}
