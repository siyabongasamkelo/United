// 📂 File: src/features/manager-console/components/ActivePersonnelMatrix.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { People, Phone } from "@mui/icons-material";

interface Porter {
  id: string;
  fullName: string;
  role: string;
  clockInTime: string; // Real ISO string context from backend
  phoneNumber: string;
}

interface ActivePersonnelMatrixProps {
  livePorters?: Porter[];
}

export function ActivePersonnelMatrix({
  livePorters = [],
}: ActivePersonnelMatrixProps) {
  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: "#cbd5e1", mt: 1 }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <People sx={{ color: "#16a34a", fontSize: 22 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Active Floor Deployment Matrix ({livePorters.length} Porters Live)
          </Typography>
        </Box>

        {livePorters.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", py: 2 }}
          >
            No active porters clocked in on the floor for today's shifts yet.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {livePorters.map((porter) => {
              // 🚀 Format the raw backend ISO timestamp nicely for the District Director
              const formattedTime = porter.clockInTime
                ? new Date(porter.clockInTime).toLocaleTimeString("en-ZA", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now";

              return (
                <Card
                  key={porter.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: "#e2e8f0",
                    bgcolor: "#f8fafc",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "800", color: "#1e1b4b" }}
                      >
                        {porter.fullName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: "600",
                          display: "block",
                        }}
                      >
                        Assignment Context: <strong>{porter.role}</strong>
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#94a3b8", display: "block" }}
                      >
                        GPS Verified Clock-In: {formattedTime}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Phone sx={{ fontSize: 16 }} />}
                      href={`tel:${porter.phoneNumber}`}
                      sx={{
                        bgcolor: "#1e1b4b",
                        fontWeight: "700",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#2e2a72" },
                      }}
                    >
                      Call Porter
                    </Button>
                  </Box>
                </Card>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
