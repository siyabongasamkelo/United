import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

interface ScanFeedbackOverlayProps {
  isSubmitting: boolean;
  feedback: { type: "success" | "error"; msg: string; delta?: number } | null;
}

export function ScanFeedbackOverlay({
  isSubmitting,
  feedback,
}: ScanFeedbackOverlayProps) {
  if (isSubmitting) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          gap: 1.5,
        }}
      >
        <CircularProgress sx={{ color: "#1e1b4b" }} />
        <Typography
          variant="caption"
          sx={{ color: "#64748b", fontWeight: "700" }}
        >
          🛰️ Querying Hardware Satellites & Calculating Geofences...
        </Typography>
      </Box>
    );
  }

  if (!feedback) return null;

  const isSuccess = feedback.type === "success";

  return (
    <Alert
      severity={feedback.type}
      icon={
        isSuccess ? (
          <CheckCircle sx={{ fontSize: 24 }} />
        ) : (
          <Cancel sx={{ fontSize: 24 }} />
        )
      }
      sx={{
        borderRadius: 3,
        p: 2,
        mb: 3,
        border: "1px solid",
        borderColor: isSuccess ? "#bbf7d0" : "#fecaca",
        bgcolor: isSuccess ? "#f0fdf4" : "#fef2f2",
        "& .MuiAlert-message": { width: "100%" },
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: "900", mb: 0.5 }}>
        {isSuccess
          ? "Sweep Entry Verified Successfully"
          : "Verification Security Warning Flags"}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontSize: "0.85rem", opacity: 0.9, lineHeight: 1.4, mb: 1 }}
      >
        {feedback.msg}
      </Typography>
      {feedback.delta !== undefined && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Computed Tracking Deviation: <strong>{feedback.delta} meters</strong>{" "}
          from center checkpoint marker.
        </Typography>
      )}
    </Alert>
  );
}
