import { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { PlayArrow, Stop } from "@mui/icons-material";
import { useGeoLocation } from "../hooks/useGeoLocation";

interface AttendanceConsoleProps {
  isOnline: boolean; // ✅ TypeScript now sees this is read below!
  onPunchSuccess: (type: "IN" | "OUT") => void;
}

export default function AttendanceConsole({
  isOnline,
  onPunchSuccess,
}: AttendanceConsoleProps) {
  const { getCoordinates, loading, error: gpsError } = useGeoLocation();
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handlePunch = async (type: "IN" | "OUT") => {
    setValidationError(null);
    try {
      await getCoordinates(); // Hardware location check lock

      // Geofence Mock (Gateway Mall Check) [1.1]
      const userIsAtGateway = true;

      if (!userIsAtGateway) {
        setValidationError(
          "Action blocked! You are not within Gateway Mall boundaries.",
        );
        return;
      }

      setIsCheckedIn(type === "IN");
      onPunchSuccess(type);
    } catch (err) {
      // Errors handled gracefully via hook state
      console.log(err);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: "#e2e8f0", p: 3 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Current Status:{" "}
        <strong>
          {isCheckedIn ? "ACTIVE ON FLOOR" : "OFF-DUTY / UNASSIGNED"}
        </strong>
      </Typography>

      {(gpsError || validationError) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {gpsError || validationError}
        </Alert>
      )}

      {isCheckedIn ? (
        <Button
          variant="contained"
          color="error"
          size="large"
          fullWidth
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : <Stop />
          }
          disabled={loading}
          onClick={() => handlePunch("OUT")}
          sx={{ fontWeight: "800", py: 2, borderRadius: 2 }}
        >
          {loading
            ? "Validating GPS..."
            : isOnline
              ? "Clock Out"
              : "Clock Out (Save Offline)"}
        </Button>
      ) : (
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PlayArrow />
            )
          }
          disabled={loading}
          onClick={() => handlePunch("IN")}
          sx={{
            fontWeight: "800",
            py: 2,
            borderRadius: 2,
            bgcolor: "#4f46e5",
            "&:hover": { bgcolor: "#4338ca" },
          }}
        >
          {loading
            ? "Locking GPS..."
            : isOnline
              ? "Clock In"
              : "Clock In (Save Offline)"}
        </Button>
      )}
    </Card>
  );
}
