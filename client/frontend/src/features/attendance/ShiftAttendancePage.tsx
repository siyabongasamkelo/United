import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid, Alert } from "@mui/material";
import { WifiOff, CloudDone } from "@mui/icons-material";
import AttendanceConsole from "./components/AttendanceConsole";

interface PunchRecord {
  type: "IN" | "OUT";
  timestamp: string;
  isOffline: boolean;
}

export default function ShiftAttendancePage() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [localHistory, setLocalHistory] = useState<PunchRecord[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const processPunch = (punchType: "IN" | "OUT") => {
    const newRecord: PunchRecord = {
      type: punchType,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      isOffline: !isOnline,
    };
    setLocalHistory((prev) => [newRecord, ...prev]);
  };

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
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Geofenced Shift Validation Matrix
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            This portal is not built to monitor your every move or to serve as a
            tool for punishment. We log coordinates exclusively during arrival
            and departure for a highly transparent purpose:{" "}
            <strong>
              to protect your wages and eliminate word-of-mouth disputes
            </strong>{" "}
            [1.1, 1.2].
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            By stamping your precise location directly onto the roster, you
            create an un-faked, digital proof of your execution. If you arrive
            early or work late, your credit is locked in automatically [1.2]. No
            arguments, no lost shifts, and absolute clarity on payroll tracking
            [1.1].
          </Typography>
        </CardContent>
      </Card>

      {/* ONLINE/OFFLINE NETWORK CONSOLE ALERT BANNER */}
      <Box sx={{ mb: 4 }}>
        {!isOnline ? (
          <Alert
            severity="warning"
            icon={<WifiOff />}
            sx={{ borderRadius: 2, fontWeight: "600" }}
          >
            Operating Offline Mode. Core system active over low mall signals.
            All logs save to local cache storage.
          </Alert>
        ) : (
          <Alert
            severity="success"
            icon={<CloudDone />}
            sx={{
              borderRadius: 2,
              fontWeight: "600",
              bgcolor: "#ecfdf5",
              color: "#065f46",
            }}
          >
            Network Connected. Real-time supervisor sync engine active.
          </Alert>
        )}
      </Box>

      {/* ❷ USER INTERACTIVE INPUT CONSOLE CONTAINER */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 5 }}>
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
            Roster Control Console
          </Typography>
          <AttendanceConsole
            isOnline={isOnline}
            onPunchSuccess={processPunch}
          />
        </Grid>

        {/* ❸ DYNAMIC LOOP DISPLAY CARDS */}
        <Grid size={{ xs: 12, md: 7 }}>
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
            Today's Verification Streams
          </Typography>

          {localHistory.length === 0 ? (
            <Card
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                borderStyle: "dashed",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No attendance events recorded for this session yet.
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {localHistory.map((log, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{ borderRadius: 2, borderColor: "#e2e8f0" }}
                >
                  <CardContent
                    sx={{
                      py: "16px !important",
                      px: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color={log.type === "IN" ? "#10b981" : "#ef4444"}
                        sx={{ fontWeight: "800" }}
                      >
                        SHIFT PUNISHED: PUNCH-{log.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Registered Timestamp: {log.timestamp}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          bgcolor: log.isOffline ? "#fef3c7" : "#d1fae5",
                          color: log.isOffline ? "#d97706" : "#059669",
                          borderRadius: 5,
                          fontWeight: "700",
                        }}
                      >
                        {log.isOffline ? "Local Cache" : "Synced"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
