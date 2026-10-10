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
import { AccessTime, Security, Beenhere } from "@mui/icons-material";
import { useAttendanceForm } from "../hooks/useAttendanceForm";

export default function AttendanceConsole() {
  const a = useAttendanceForm();

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
        {/* Title Header Section */}
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
          <strong>{a.currentUser?.fullName || "Resolving Profile..."}</strong>
        </Typography>

        {a.feedback && (
          <Alert
            severity={a.feedback.type}
            sx={{ mb: 3, borderRadius: 2, fontWeight: "600" }}
          >
            {a.feedback.msg}
          </Alert>
        )}

        <Box component="form" onSubmit={a.handleClockInSubmit}>
          <Stack spacing={3}>
            {/* Shift Designation Select Inputs */}
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
                <MenuItem value="REINFORCEMENT">Reinforcement Shift</MenuItem>
                <MenuItem value="NIGHT_SWEEPERS">Night Sweepers</MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ borderStyle: "dashed" }} />

            {/* OHS Compliance Declaration Layout Blocks */}
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
                      onChange={(e) => a.setHasSafetyBoots(e.target.checked)}
                      color="success"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "600", color: "#334155" }}
                    >
                      I am wearing steel-toe safety boots [Protective Footwear]
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={a.hasReflectorVest}
                      onChange={(e) => a.setHasReflectorVest(e.target.checked)}
                      color="success"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "600", color: "#334155" }}
                    >
                      I am wearing a high-visibility visibility reflector vest
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={a.hasSteeringRope}
                      onChange={(e) => a.setHasSteeringRope(e.target.checked)}
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

            {/* Submit Control Action Triggers */}
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
          </Stack>
        </Box>

        {/* Shift Logging History Feed Timeline Display */}
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
                        Time: {new Date(log.clockInTime).toLocaleTimeString()}{" "}
                        &bull; Status: Geofence Locked ✅
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
