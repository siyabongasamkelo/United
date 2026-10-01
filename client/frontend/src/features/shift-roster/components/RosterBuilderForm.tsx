import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Chip,
  Grid,
  Alert,
} from "@mui/material";
import { ArrowForward, EventAvailable, Refresh } from "@mui/icons-material";

// Our baseline crew pool of 12 porters
const initialPorters = [
  { id: 1, name: "Sipho Nkomo" },
  { id: 2, name: "Blessed Dube" },
  { id: 3, name: "Musa Ndlovu" },
  { id: 4, name: "Thabo Khumalo" },
  { id: 5, name: "Lungelo Cele" },
  { id: 6, name: "Mandla Khoza" },
  { id: 7, name: "Sibusiso Zulu" },
  { id: 8, name: "Nkululeko Nxumalo" },
  { id: 9, name: "Bandile Mthembu" },
  { id: 10, name: "Jabu Sithole" },
  { id: 11, name: "Kevin Naidoo" },
  { id: 12, name: "Thami Zondi" },
];

export default function RosterBuilderForm() {
  // Track where each porter is assigned: 'unassigned' | 'morning' | 'reinforcement' | 'night' | 'off'
  const [assignments, setAssignments] = useState<Record<number, string>>(
    initialPorters.reduce((acc, p) => ({ ...acc, [p.id]: "unassigned" }), {}),
  );

  // Menu anchor states for tracking which porter card was clicked
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activePorterId, setActivePorterId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePorterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setActivePorterId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActivePorterId(null);
  };

  const assignShift = (shiftType: string) => {
    if (activePorterId !== null) {
      setAssignments((prev) => ({ ...prev, [activePorterId]: shiftType }));
      setSuccessMsg(`Assigned cleanly to ${shiftType.toUpperCase()} shift.`);
      setTimeout(() => setSuccessMsg(null), 3000); // Clear toast automatically
    }
    handleMenuClose();
  };

  const resetRoster = () => {
    setAssignments(
      initialPorters.reduce((acc, p) => ({ ...acc, [p.id]: "unassigned" }), {}),
    );
  };

  // Helper filters to group porters based on state metrics
  const getPortersInShift = (shiftType: string) =>
    initialPorters.filter((p) => assignments[p.id] === shiftType);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: "#cbd5e1",
        bgcolor: "#ffffff",
        mb: 4,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        {/* Title and Reset Bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <EventAvailable sx={{ color: "#4f46e5", fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight="900" color="#1e1b4b">
              Effortless Shift Allocator
            </Typography>
          </Stack>
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={resetRoster}
            sx={{ textTransform: "none", fontWeight: "700", color: "#64748b" }}
          >
            Clear All
          </Button>
        </Stack>

        {/* Status Notification Alerts */}
        {successMsg && (
          <Alert
            severity="success"
            icon={false}
            sx={{ mb: 2, borderRadius: 2, py: 0, fontWeight: "600" }}
          >
            {successMsg}
          </Alert>
        )}

        {/* STEP 1: POOL OF PORTERS */}
        {/* STEP 1: POOL OF PORTERS */}
        <Box
          sx={{
            mb: 4,
            p: 2,
            bgcolor: "#f8fafc",
            borderRadius: 2.5,
            border: "1px dashed #cbd5e1",
          }}
        >
          <Typography
            variant="caption"
            fontWeight="800"
            color="text.secondary"
            sx={{ display: "block", mb: 1.5, textTransform: "uppercase" }}
          >
            👉 Tap a Porter to Deploy Them Instantaneously
          </Typography>

          {/* 💡 FIXED CONTAINER BELOW: Added flexWrap and useFlexGap to drop buttons onto the next row automatically */}
          <Stack
            direction="row"
            flexWrap="wrap"
            useFlexGap
            spacing={1}
            sx={{ gap: 1 }}
          >
            {getPortersInShift("unassigned").map((p) => (
              <Button
                key={p.id}
                variant="outlined"
                size="small"
                endIcon={<ArrowForward sx={{ fontSize: 12 }} />}
                onClick={(e) => handlePorterClick(e, p.id)}
                sx={{
                  textTransform: "none",
                  fontWeight: "700",
                  color: "#334155",
                  borderColor: "#cbd5e1",
                  bgcolor: "#ffffff",
                }}
              >
                {p.name}
              </Button>
            ))}
            {getPortersInShift("unassigned").length === 0 && (
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ fontStyle: "italic" }}
              >
                All 12 porters have been successfully assigned onto the grid
                matrix.
              </Typography>
            )}
          </Stack>
        </Box>

        {/* STEP 2: ACTIVE SHIFT GRID MATRIX DROPS */}
        <Grid container spacing={2}>
          {[
            {
              key: "morning",
              title: "🌅 MORNING WAVE",
              bg: "#fffbeb",
              color: "#b45309",
            },
            {
              key: "reinforcement",
              title: "☀️ REINFORCEMENT",
              bg: "#eff6ff",
              color: "#1d4ed8",
            },
            {
              key: "night",
              title: "🌙 NIGHT SWEEPERS",
              bg: "#e0e7ff",
              color: "#4338ca",
            },
            {
              key: "off",
              title: "💤 OFF TODAY",
              bg: "#f1f5f9",
              color: "#475569",
            },
          ].map((shift) => (
            <Grid item xs={12} sm={6} key={shift.key}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: shift.bg,
                  borderRadius: 2,
                  height: "100%",
                  minHeight: "120px",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="900"
                  sx={{ color: shift.color, display: "block", mb: 1 }}
                >
                  {shift.title} ({getPortersInShift(shift.key).length})
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.5}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ gap: 0.5 }}
                >
                  {getPortersInShift(shift.key).map((p) => (
                    <Chip
                      key={p.id}
                      label={p.name}
                      size="small"
                      onDelete={() =>
                        setAssignments((prev) => ({
                          ...prev,
                          [p.id]: "unassigned",
                        }))
                      }
                      sx={{
                        fontWeight: "700",
                        bgcolor: "#ffffff",
                        border: "1px solid #cbd5e1",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* THE FLYOUT CLICK MENU OVERLAY CONTROL */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          elevation={2}
          sx={{
            "& .MuiMenuItem-root": { fontWeight: "600", fontSize: "0.85rem" },
          }}
        >
          <MenuItem onClick={() => assignShift("morning")}>
            Deploy to Morning Wave (06:00)
          </MenuItem>
          <MenuItem onClick={() => assignShift("reinforcement")}>
            Deploy to Reinforcements (11:00)
          </MenuItem>
          <MenuItem onClick={() => assignShift("night")}>
            Deploy to Night Sweepers (17:00)
          </MenuItem>
          <MenuItem onClick={() => assignShift("off")}>
            Mark as Mandatory Off Today
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
