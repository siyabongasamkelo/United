import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { QrCodeScanner, DoubleArrow } from "@mui/icons-material";
import { useStoreScan } from "./hooks/useStoreScan";
import { QRScannerViewport } from "./components/QRScannerViewport";
import { ScanFeedbackOverlay } from "./components/ScanFeedbackOverlay";

export default function StoreScanPage() {
  const s = useStoreScan();

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "480px", mx: "auto" }}>
      {/* ❶ MODULE TITLE CARD - Always loads immediately now */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "#cbd5e1",
          bgcolor: "#ffffff",
          mb: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1 }}>
            <QrCodeScanner sx={{ color: "#4f46e5", fontSize: 24 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "900", color: "#1e1b4b", fontSize: "1.1rem" }}
            >
              Store Sweep Double Verification
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#64748b", lineHeight: 1.5, display: "block" }}
          >
            Scan the laminated location QR code pinned inside the target store
            trolley bay. The terminal will automatically verify your satellite
            coordinates to authenticate labor density.
          </Typography>
        </CardContent>
      </Card>

      {/* ❷ FEEDBACK PROCESS DISPLAY TILES */}
      <ScanFeedbackOverlay
        isSubmitting={s.isSubmitting}
        feedback={s.feedback}
      />

      {/* ❸ THE LIVE STREAM VIDEO VIEWPORT ELEMENT */}
      <QRScannerViewport
        videoRef={s.videoRef}
        isScanning={s.isScanning}
        onStart={s.startCamera}
        onStop={s.stopCamera}
      />

      {/* ❹ LOCALIZED DESKTOP EMULATION CONTROL PANEL */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderStyle: "dashed",
          borderColor: "#cbd5e1",
          bgcolor: "#f8fafc",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: "800",
              color: "#475569",
              display: "block",
              mb: 1.5,
              textTransform: "uppercase",
            }}
          >
            🔧 Desktop Emulation Test Bench
          </Typography>
          <Stack spacing={1}>
            <Button
              variant="outlined"
              size="small"
              color="info"
              endIcon={<DoubleArrow />}
              disabled={s.isSubmitting || s.isScanning}
              onClick={() => s.handleDecodedQR("651f1234567890abcdef0010")}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: "700",
                justifyContent: "space-between",
                bgcolor: "#ffffff",
              }}
            >
              Simulate Sweep: Inside Game Store (Success Test)
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="warning"
              endIcon={<DoubleArrow />}
              disabled={s.isSubmitting || s.isScanning}
              onClick={() => s.handleDecodedQR("651f1234567890abcdef9999")}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: "700",
                justifyContent: "space-between",
                bgcolor: "#ffffff",
              }}
            >
              Simulate Sweep: Wrong Coordinates (Fraud Test)
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
