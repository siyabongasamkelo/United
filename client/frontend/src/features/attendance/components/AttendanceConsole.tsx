// 📂 File: src/features/attendance/components/AttendanceConsole.tsx

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AccessTime, Security, Beenhere, ExitToApp } from "@mui/icons-material"; // 🆕 Added ExitToApp icon
import { useAttendanceForm } from "../hooks/useAttendanceForm";

interface AttendanceConsoleProps {
  isOnline: boolean;
  onPunchSuccess: (punchType: "IN" | "OUT") => void;
}

export default function AttendanceConsole({
  isOnline,
  onPunchSuccess,
}: AttendanceConsoleProps) {
  const a = useAttendanceForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await a.handleClockInSubmit(e);

    if (onPunchSuccess) {
      onPunchSuccess("IN");
    }
  };

  // 🆕 HANDLER FOR DEDICATED CLOCK OUT ACTION
  const handleClockOutClick = async () => {
    await a.handleClockOutSubmit(() => {
      if (onPunchSuccess) {
        onPunchSuccess("OUT");
      }
    });
  };

  // 🆕 CHECK IF WORKER HAS AN ACTIVE RUNNING LOG RIGHT NOW
  const hasActiveShift = a.historyLogs.some((log) => log.status === "ACTIVE");

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: "#cbd5e1",
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
        mb: 4,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <AccessTime sx={{ color: "#4f46e5", fontSize: 24 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "900", color: "#1e1b4b", fontSize: "1.1rem" }}
          >
            Worker Time & Attendance Portal
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "#64748b", mb: 3, fontWeight: "500", display: "block" }}
        >
          Active Operator:{" "}
          <strong>{a.currentUser?.fullName || "Resolving Profile..."}</strong>{" "}
          &bull; Network State:{" "}
          {isOnline ? "Cloud Active" : "Offline Local Mode"}
        </Typography>

        {a.feedback && (
          <Alert
            severity={a.feedback.type}
            sx={{ mb: 3, borderRadius: 2, fontWeight: "600" }}
          >
            {a.feedback.msg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleFormSubmit}>
          <Stack spacing={3}>
            {/* HIDE INPUTS IF ALREADY RUNNING A SHIFT TO PREVENT MULTI-CLOCK CONFLICTS */}
            {!hasActiveShift ? (
              <>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="shift-wave-label">
                    Select Active Shift Wave
                  </InputLabel>
                  <Select
                    labelId="shift-wave-label"
                    value={a.shiftWave}
                    label="Select Active Shift Wave"
                    onChange={(e) => a.setShiftWave(e.target.value)}
                  >
                    <MenuItem value="MORNING">Morning Shift</MenuItem>
                    <MenuItem value="REINFORCEMENT">
                      Reinforcement Shift
                    </MenuItem>
                    <MenuItem value="NIGHT_SWEEPERS">Night Sweepers</MenuItem>
                  </Select>
                </FormControl>

                <Divider sx={{ borderStyle: "dashed" }} />

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1.5,
                    }}
                  >
                    <Security sx={{ color: "#64748b", fontSize: 18 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "800",
                        color: "#475569",
                        textTransform: "uppercase",
                      }}
                    >
                      Un-skippable PPE & Gear Compliance Check
                    </Typography>
                  </Box>

                  <Stack spacing={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={a.hasSafetyBoots}
                          onChange={(e) =>
                            a.setHasSafetyBoots(e.target.checked)
                          }
                          color="success"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "600", color: "#334155" }}
                        >
                          I am wearing steel-toe safety boots [Protective
                          Footwear]
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={a.hasReflectorVest}
                          onChange={(e) =>
                            a.setHasReflectorVest(e.target.checked)
                          }
                          color="success"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "600", color: "#334155" }}
                        >
                          I am wearing a high-visibility visibility reflector
                          vest
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={a.hasSteeringRope}
                          onChange={(e) =>
                            a.setHasSteeringRope(e.target.checked)
                          }
                          color="success"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "600", color: "#334155" }}
                        >
                          I have my mandatory 5-trolley control steering rope
                          present
                        </Typography>
                      }
                    />
                  </Stack>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={a.isSubmitting || !a.currentUser}
                  endIcon={<Beenhere />}
                  sx={{
                    bgcolor: "#1e1b4b",
                    fontWeight: "800",
                    textTransform: "none",
                    py: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#2e2a72" },
                  }}
                >
                  {a.isSubmitting
                    ? "Verifying Geofence & Transmitting..."
                    : "Secure Clock-In Shift"}
                </Button>
              </>
            ) : (
              /* 🆕 DYNAMIC RE-RENDER IF THE OPERATOR IS CLOCKED IN: DISPLAY DEDICATED CLOCK-OUT MODULE */
              <Box
                sx={{
                  p: 2,
                  border: "1px dashed #ef4444",
                  borderRadius: 2,
                  bgcolor: "#fef2f2",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#991b1b", fontWeight: "700", mb: 2 }}
                >
                  ⚠️ Shift Status Action Required: You have an ongoing shift
                  active on the layout lane roster.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  disabled={a.isSubmitting}
                  onClick={handleClockOutClick}
                  endIcon={<ExitToApp />}
                  sx={{
                    fontWeight: "800",
                    textTransform: "none",
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor: "#dc2626",
                    "&:hover": { bgcolor: "#b91c1c" },
                  }}
                >
                  {a.isSubmitting
                    ? "Updating Coordinates & Syncing..."
                    : "Secure Clock-Out (End Shift)"}
                </Button>
              </Box>
            )}
          </Stack>
        </Box>

        {a.historyLogs.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: "800",
                color: "text.secondary",
                textTransform: "uppercase",
                display: "block",
                mb: 1,
              }}
            >
              Your Registered Shift Logs Today
            </Typography>
            <List
              dense
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              {a.historyLogs.map((log) => (
                <ListItem
                  key={log._id}
                  divider
                  sx={{ "&:last-child": { borderBottom: "none" } }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "700", color: "#0f172a" }}
                      >
                        Shift Wave: {log.shiftWave}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        In: {new Date(log.clockInTime).toLocaleTimeString()}
                        {log.clockOutTime &&
                          ` &bull; Out: ${new Date(log.clockOutTime).toLocaleTimeString()}`}
                        {` &bull; Status: `}
                        <strong
                          style={{
                            color:
                              log.status === "ACTIVE" ? "#3b82f6" : "#10b981",
                          }}
                        >
                          {log.status}
                        </strong>
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
