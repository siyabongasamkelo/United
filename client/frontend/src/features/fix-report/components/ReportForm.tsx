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
  MenuItem,
  Grid, // <-- ADDED THIS ONE LINE
} from "@mui/material";
import { Build, Send } from "@mui/icons-material";

const stores = ["★ GAME STORE", "CLICKS PHARMACY", "DIS-CHEM"];
const components = ["Chassis", "Wire Basket", "Back-Gate", "Castor Wheels"];
const severities = ["Low", "Medium", "High"];

export default function ReportForm() {
  const [trolleyNum, setTrolleyNum] = useState("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trolleyNum || !selectedStore || !selectedPart || !selectedSeverity)
      return;

    console.log("Logged Defect Payload:", {
      trolleyNum,
      selectedStore,
      selectedPart,
      selectedSeverity,
    });
    setFeedback(
      `Successfully logged ${trolleyNum}! Added to Maintenance Queue.`,
    );

    setTrolleyNum("");
    setSelectedStore(null);
    setSelectedPart(null);
    setSelectedSeverity(null);
    setTimeout(() => setFeedback(null), 3000);
  };

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
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Build sx={{ color: "#4f46e5", fontSize: 22 }} />
          <Typography variant="subtitle1" fontWeight="900" color="#1e1b4b">
            Log Broken Equipment Frame
          </Typography>
        </Stack>

        {feedback && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {feedback}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Trolley ID Number (e.g. UTS-042)"
              variant="outlined"
              size="small"
              required
              value={trolleyNum}
              onChange={(e) => setTrolleyNum(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={stores}
                  value={selectedStore}
                  onChange={(_, val) => setSelectedStore(val)}
                  renderInput={(p) => (
                    <TextField
                      {...p}
                      label="Store Origin"
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={components}
                  value={selectedPart}
                  onChange={(_, val) => setSelectedPart(val)}
                  renderInput={(p) => (
                    <TextField
                      {...p}
                      label="Broken Component"
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={severities}
                  value={selectedSeverity}
                  onChange={(_, val) => setSelectedSeverity(val)}
                  renderInput={(p) => (
                    <TextField
                      {...p}
                      label="Damage Severity"
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              endIcon={<Send />}
              sx={{
                bgcolor: "#1e1b4b",
                textTransform: "none",
                py: 1,
                borderRadius: 2,
              }}
            >
              Send to Maintenance Compound
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
