import { Box, Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

export function FleetPhotoChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        bgcolor: "#f1f5f9",
        border: "1px solid #cbd5e1",
        borderRadius: 2,
        pl: 1.5,
        pr: 0.5,
        py: 0.25,
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: "#334155", fontWeight: "600" }}
      >
        {label}
      </Typography>
      <IconButton
        size="small"
        onClick={onClear}
        sx={{ color: "#ef4444", p: 0.25 }}
      >
        <Delete sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
}
