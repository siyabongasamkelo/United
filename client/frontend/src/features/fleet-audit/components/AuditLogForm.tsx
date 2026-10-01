import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Autocomplete,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { Send, PlaylistAddCheck } from "@mui/icons-material";

// Explicit store selector list to prevent spelling errors
const storeOptions = [
  { label: "★ GAME STORE", id: 1 },
  { label: "CLICKS PHARMACY", id: 2 },
  { label: "DIS-CHEM", id: 3 },
];

export default function AuditLogForm() {
  // Local form states
  const [selectedStore, setSelectedStore] = useState<{
    label: string;
    id: number;
  } | null>(null);
  const [totalCount, setTotalCount] = useState<string>("");
  const [damagedCount, setDamagedCount] = useState<string>("");
  const [dirtyCount, setDirtyCount] = useState<string>("");

  // Feedback states for submission acknowledgment
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Quick structural validation gate
    if (!selectedStore || !totalCount) {
      setFeedback({
        type: "error",
        msg: "Failed: Please select a store and enter the total fleet count.",
      });
      return;
    }

    // Mock processing logic (In the future, this object feeds straight to your backend API!)
    const payload = {
      storeId: selectedStore.id,
      storeName: selectedStore.label,
      total: parseInt(totalCount, 10),
      damaged: damagedCount ? parseInt(damagedCount, 10) : 0,
      dirty: dirtyCount ? parseInt(dirtyCount, 10) : 0,
      timestamp: new Date().toISOString(),
    };

    console.log("Supervisor Log Payload Submitted:", payload);

    // Trigger localized visual success feedback
    setFeedback({
      type: "success",
      msg: `Logged successfully! ${selectedStore.label} set to ${totalCount} units.`,
    });

    // Clear form inputs cleanly
    setSelectedStore(null);
    setTotalCount("");
    setDamagedCount("");
    setDirtyCount("");
  };

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
        {/* Form Title Heading */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <PlaylistAddCheck sx={{ color: "#4f46e5", fontSize: 22 }} />
          <Typography variant="subtitle1" fontWeight="900" color="#1e1b4b">
            Supervisor Daily Log Console
          </Typography>
        </Box>

        {/* Dynamic User Alert Banner */}
        {feedback && (
          <Alert
            severity={feedback.type}
            sx={{ mb: 3, borderRadius: 2, fontWeight: "600" }}
          >
            {feedback.msg}
          </Alert>
        )}

        {/* Core Submission Form */}
        <Box component="form" onSubmit={handleFormSubmit}>
          <Stack spacing={2.5}>
            {/* ❶ SEARCHABLE DROP DOWN: Eliminates spelling or naming errors */}
            <Autocomplete
              options={storeOptions}
              getOptionLabel={(option) => option.label}
              value={selectedStore}
              onChange={(event, newValue) => {
                setSelectedStore(newValue);
                setFeedback(null); // Clear errors dynamically
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Target Store"
                  variant="outlined"
                  size="small"
                  required
                />
              )}
            />

            {/* ❷ NUMBER INPUT FIELDS: Automatically opens number pads on mobile devices */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Total Trolleys on Floor"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={totalCount}
                onChange={(e) => setTotalCount(e.target.value)}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Damaged Count (If any)"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={damagedCount}
                onChange={(e) => setDamagedCount(e.target.value)}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Dirty Count (If any)"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={dirtyCount}
                onChange={(e) => setDirtyCount(e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Stack>

            {/* ❸ ACTION SUBMIT BUTTON */}
            <Button
              type="submit"
              variant="contained"
              endIcon={<Send />}
              sx={{
                bgcolor: "#1e1b4b",
                fontWeight: "800",
                textTransform: "none",
                py: 1,
                borderRadius: 2,
                "&:hover": { bgcolor: "#2e2a72" },
              }}
            >
              Submit Shift Stock-Take
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
