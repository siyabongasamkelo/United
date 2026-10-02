import { Box, Typography, Card, CardContent, Stack, Chip } from "@mui/material";
import { WbSunny, LightMode, DarkMode, Bedtime } from "@mui/icons-material";
import type { DailyRoster, PorterAssignment } from "../data/mockRoster";

interface DailyTimelineProps {
  roster: DailyRoster;
}

export default function DailyTimeline({ roster }: DailyTimelineProps) {
  // Clean reusable card row component for individual porters
  const PorterRow = ({ porter }: { porter: PorterAssignment }) => {
    const isOff = porter.status === "Off Day";
    const isGuard = porter.status === "Guard";

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.5,
          borderBottom: "1px solid #f1f5f9",
          "&:last-child": { borderBottom: "none" },
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color={isOff ? "text.disabled" : "#0f172a"}
            sx={{ fontWeight: "700" }}
          >
            {porter.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: "500" }}
          >
            📍 {porter.location}
          </Typography>
        </Box>
        <Chip
          label={porter.status}
          size="small"
          variant={isOff ? "outlined" : "filled"}
          color={isOff ? "default" : isGuard ? "warning" : "success"}
          sx={{ fontWeight: "700", minWidth: "75px" }}
        />
      </Box>
    );
  };

  return (
    <Stack spacing={3}>
      {/* Wave 1: Morning Openers */}
      <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            spacing={1}
            sx={{ mb: 1.5, direction: "row", alignItems: "center" }}
          >
            <WbSunny sx={{ color: "#f59e0b", fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "900", color: "#1e1b4b" }}
            >
              MORNING WAVE (06:00 - 14:00)
            </Typography>
          </Stack>
          <Box>
            {roster.morningWave.map((p) => (
              <PorterRow key={p.id} porter={p} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Wave 2: Mid-Day Reinforcements */}
      <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            spacing={1}
            sx={{ mb: 1.5, direction: "row", alignItems: "center" }}
          >
            <LightMode sx={{ color: "#3b82f6", fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "900", color: "#1e1b4b" }}
            >
              MID-DAY REINFORCEMENTS (11:00 - 19:00)
            </Typography>
          </Stack>
          <Box>
            {roster.reinforcements.map((p) => (
              <PorterRow key={p.id} porter={p} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Wave 3: Night Sweepers */}
      <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            spacing={1}
            sx={{ mb: 1.5, direction: "row", alignItems: "center" }}
          >
            <DarkMode sx={{ color: "#4f46e5", fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "900", color: "#1e1b4b" }}
            >
              NIGHT SWEEPERS (17:00 - 22:00)
            </Typography>
          </Stack>
          <Box>
            {roster.nightSweepers.map((p) => (
              <PorterRow key={p.id} porter={p} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Wave 4: Rest Cycle Standbys */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, borderColor: "#e2e8f0", bgcolor: "#f8fafc" }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            spacing={1}
            sx={{ mb: 1.5, direction: "row", alignItems: "center" }}
          >
            <Bedtime sx={{ color: "#64748b", fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "900", color: "#475569" }}
            >
              MANDATORY OFF TODAY
            </Typography>
          </Stack>
          <Box>
            {roster.offToday.map((p) => (
              <PorterRow key={p.id} porter={p} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
