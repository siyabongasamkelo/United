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
import { Send, PlaylistAddCheck, CloudUpload } from "@mui/icons-material";
import { useFleetAuditForm } from "../hooks/useFleetAuditForm";
import { FleetPhotoChip } from "./FleetPhotoChip";

export default function FleetAuditForm() {
  const f = useFleetAuditForm();

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
          <PlaylistAddCheck sx={{ color: "#4f46e5", fontSize: 24 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "900", color: "#1e1b4b", fontSize: "1.1rem" }}
          >
            Supervisor Fleet Audit Console
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "#64748b", mb: 3, fontWeight: "500", display: "block" }}
        >
          Active Inspector:{" "}
          <strong>{f.currentUser?.fullName || "Resolving..."}</strong> (
          {f.currentUser?.role}) &bull; Branch:{" "}
          <strong>{f.currentUser?.branchId || "Unassigned"}</strong>
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
            <Autocomplete
              options={f.storeOptions}
              getOptionLabel={(opt) => opt.name} // ⚡ Clean label mapped to the literal Mongo name field!
              loading={f.isLoadingStores} // Displays clear text spin statuses to workers automatically
              value={
                f.storeOptions.find(
                  (o) => o._id === f.selectedStore?.storeId,
                ) || null
              }
              onChange={(_, val) => {
                f.setSelectedStore(
                  val ? { storeId: val._id, storeName: val.name } : null,
                );
                f.setFeedback(null);
              }}
              // Keep the rest of your TextField configuration exactly as it sits
              noOptionsText="No retail stores assigned to your branch boundary terminal record."
              renderInput={(p) => (
                <TextField
                  {...p}
                  label="Select Target Store"
                  variant="outlined"
                  size="small"
                  required
                />
              )}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Total Trolleys on Floor"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={f.totalCount}
                onChange={(e) => f.setTotalCount(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
              />
              <TextField
                label="Damaged Count (If any)"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={f.damagedCount}
                onChange={(e) => f.setDamagedCount(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
              />
              <TextField
                label="Dirty Count (If any)"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={f.dirtyCount}
                onChange={(e) => f.setDirtyCount(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Stack>

            <TextField
              label="Inspector Notes / Condition Comments (Optional)"
              variant="outlined"
              size="small"
              multiline
              rows={2}
              fullWidth
              value={f.notes}
              onChange={(e) => f.setNotes(e.target.value)}
              placeholder="Provide context..."
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />

            {/* 📸 HIDDEN FILE DIALOG COMPONENT & TRIGGER CONTROLS */}
            <Box>
              <input
                type="file"
                accept="image/*"
                ref={f.fileInputRef}
                onChange={f.handleFileChange}
                style={{ display: "none" }} // Keeps raw native HTML button hidden safely away
              />
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                disabled={f.isUploading}
                startIcon={<CloudUpload />}
                onClick={() => f.fileInputRef.current?.click()} // Programmatically trigger input selection dialog!
                sx={{
                  textTransform: "none",
                  fontWeight: "700",
                  borderRadius: 2,
                }}
              >
                {f.isUploading
                  ? "Uploading to Cloudinary..."
                  : "Upload Fleet Photos (Optional)"}
              </Button>

              {f.uploadedImages.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}
                >
                  {f.uploadedImages.map((img, idx) => (
                    // Extract the raw filename from Cloudinary's secure URL path string for neat displaying
                    <FleetPhotoChip
                      key={idx}
                      label={img.split("/").pop() || `Photo_${idx + 1}`}
                      onClear={() => f.removeImage(idx)}
                    />
                  ))}
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
                py: 1,
                borderRadius: 2,
                "&:hover": { bgcolor: "#2e2a72" },
              }}
            >
              {f.isSubmitting
                ? "Recording Audit in Database..."
                : "Submit Fleet Audit"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
