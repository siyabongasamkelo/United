import { Box, Button, Typography } from "@mui/material";
import { CameraAlt, Stop } from "@mui/icons-material";

interface QRScannerViewportProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isScanning: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function QRScannerViewport({
  videoRef,
  isScanning,
  onStart,
  onStop,
}: QRScannerViewportProps) {
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        bgcolor: "#0f172a",
        borderRadius: 3,
        overflow: "hidden",
        mb: 3,
      }}
    >
      {isScanning ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            pt: "100%" /* Force perfect 1:1 Aspect Frame Ratio */,
          }}
        >
          <video
            ref={videoRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            playsInline
            muted
          />
          {/* 🎯 DEFENSIVE UI TARGETING BOX OVERLAY: Prevents off-angle or screen-on-screen layout hacks */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70%",
              height: "70%",
              border: "3px dashed #4f46e5",
              boxShadow: "0 0 0 4000px rgba(15, 23, 42, 0.45)", // Shadows out background distraction clutter
              pointerEvents: "none",
              borderRadius: 2,
            }}
          />
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<Stop />}
            onClick={onStop}
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              textTransform: "none",
              fontWeight: "700",
            }}
          >
            Cancel Live Camera Capture
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            px: 3,
            textAlign: "center",
          }}
        >
          <Box sx={{ bgcolor: "#1e293b", p: 2, borderRadius: "50%", mb: 2 }}>
            <CameraAlt sx={{ color: "#94a3b8", fontSize: 32 }} />
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "#94a3b8", mb: 3, maxWith: "280px" }}
          >
            Camera lens stream offline. Align the physical bay QR code inside
            the targeting frame box.
          </Typography>
          <Button
            variant="contained"
            onClick={onStart}
            sx={{
              bgcolor: "#4f46e5",
              fontWeight: "800",
              textTransform: "none",
              px: 4,
              py: 1.2,
              borderRadius: 2,
            }}
          >
            Initialize Live Sweep Scanner
          </Button>
        </Box>
      )}
    </Box>
  );
}
