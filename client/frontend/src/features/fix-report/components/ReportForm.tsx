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
  Grid,
} from "@mui/material";
import { Build, Send, CloudUpload } from "@mui/icons-material";
import { useFixReportForm } from "../hooks/useFixReportForm";
import { ReportPhotoChip } from "./ReportPhotoChip";

const components = [
  "Chassis",
  "Wire Basket",
  "Back-Gate",
  "Castor Wheels",
  "Rope Mount",
  "Other / Frame",
];
const severities = ["Low", "Medium", "High"];

interface ReportFormProps {
  onReportAdded: () => void;
}

export default function ReportForm({ onReportAdded }: ReportFormProps) {
  const f = useFixReportForm(onReportAdded);

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
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
          <Build sx={{ color: "#4f46e5", fontSize: 22 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Log Broken Equipment Frame
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          sx={{ color: "#64748b", mb: 3, fontWeight: "500", display: "block" }}
        >
          Reporting Operator:{" "}
          <strong>{f.currentUser?.fullName || "Resolving..."}</strong> &bull;
          Role: <strong>{f.currentUser?.role}</strong>
        </Typography>

        {f.feedback && (
          <Alert
            severity={f.feedback.type}
            sx={{ mb: 3, borderRadius: 2, fontWeight: "600" }}
          >
            {f.feedback.msg}
          </Alert>
        )}

        <Box component="form" onSubmit={f.handleFormSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Trolley ID Number (e.g. UTS-042)"
              variant="outlined"
              size="small"
              required
              fullWidth
              value={f.trolleyId}
              onChange={(e) => f.setTrolleyId(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 15 } }}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Autocomplete
                  options={f.liveStores}
                  loading={f.isLoadingStores}
                  getOptionLabel={(opt) => opt.name} // ⚡ Displays real seeded name ("★ GAME STORE", etc.) [3.2]
                  value={f.selectedStore}
                  onChange={(_, val) => f.setSelectedStore(val)}
                  noOptionsText="No authorized branch configurations found."
                  renderInput={(p) => (
                    <TextField
                      {...p}
                      label={
                        f.isLoadingStores
                          ? "Loading Seeding Tracks..."
                          : "Store Origin"
                      }
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Autocomplete
                  options={components}
                  value={f.selectedComponent}
                  onChange={(_, val) => f.setSelectedComponent(val)}
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

              <Grid size={{ xs: 12, sm: 4 }}>
                <Autocomplete
                  options={severities}
                  value={f.selectedSeverity}
                  onChange={(_, val) => f.setSelectedSeverity(val)}
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

            <TextField
              label="Specific Damage Notes (Structural issues, frozen state details) (Optional)"
              variant="outlined"
              size="small"
              multiline
              rows={2}
              fullWidth
              value={f.notes}
              onChange={(e) => f.setNotes(e.target.value)}
              placeholder="E.g., rear castor wheel completely seized after month-end heavy loading sweeps..."
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />

            {/* 📸 INTEGRATED CLOUDINARY FILE DIALOG CAPTURE CONTAINER */}
            <Box>
              <input
                type="file"
                accept="image/*"
                ref={f.fileInputRef}
                onChange={f.handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                disabled={f.isUploading}
                startIcon={<CloudUpload />}
                onClick={() => f.fileInputRef.current?.click()}
                sx={{
                  textTransform: "none",
                  fontWeight: "700",
                  borderRadius: 2,
                }}
              >
                {f.isUploading
                  ? "Streaming Frame to Cloudinary..."
                  : "Attach Defect Photo (Optional)"}
              </Button>

              {f.uploadedImageUrl && (
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <ReportPhotoChip
                    label={
                      f.uploadedImageUrl.split("/").pop() ||
                      "Attached_Evidence.png"
                    }
                    onClear={f.removeImage}
                  />
                </Stack>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={f.isSubmitting || f.isUploading || !f.currentUser}
              endIcon={<Send />}
              sx={{
                bgcolor: "#1e1b4b",
                fontWeight: "800",
                textTransform: "none",
                py: 1.25,
                borderRadius: 2,
                "&:hover": { bgcolor: "#2e2a72" },
              }}
            >
              {f.isSubmitting
                ? "Routing to Workshop Yard..."
                : "Send to Maintenance Compound"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
