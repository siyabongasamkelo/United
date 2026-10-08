import { Box, Typography, Button, Stack } from "@mui/material";
import { Draw, Refresh } from "@mui/icons-material";

interface QuizSignaturePadProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isSubmitting: boolean;
  onStartDrawing: (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => void;
  onDraw: (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => void;
  onStopDrawing: () => void;
  onClear: () => void;
  onSubmit: () => void;
}

export default function QuizSignaturePad({
  canvasRef,
  isSubmitting,
  onStartDrawing,
  onDraw,
  onStopDrawing,
  onClear,
  onSubmit,
}: QuizSignaturePadProps) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Draw sx={{ color: "#4f46e5", fontSize: 22 }} />
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "900", color: "#1e1b4b" }}
        >
          Legal Sign-off & Confirmation
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{ color: "#64748b", mb: 3, display: "block", fontWeight: "500" }}
      >
        By signing below, I certify that I have read the training details and
        verified my operational competency answers.
      </Typography>

      <Box
        sx={{
          border: "2px dashed #cbd5e1",
          borderRadius: 3,
          bgcolor: "#f8fafc",
          overflow: "hidden",
          mb: 2,
          height: "180px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          onMouseDown={onStartDrawing}
          onMouseMove={onDraw}
          onMouseUp={onStopDrawing}
          onMouseLeave={onStopDrawing}
          onTouchStart={onStartDrawing}
          onTouchMove={onDraw}
          onTouchEnd={onStopDrawing}
          style={{
            width: "100%",
            height: "100%",
            cursor: "crosshair",
            display: "block",
          }}
        />
      </Box>

      <Stack direction="row" sx={{ mb: 4 }}>
        <Button
          variant="text"
          color="error"
          startIcon={<Refresh />}
          onClick={onClear}
          sx={{ textTransform: "none", fontWeight: "700" }}
        >
          Clear Signature Canvas
        </Button>
      </Stack>

      <Button
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        onClick={onSubmit}
        sx={{
          bgcolor: "#4f46e5",
          fontWeight: "800",
          textTransform: "none",
          py: 1.5,
          borderRadius: 2,
          "&:hover": { bgcolor: "#4338ca" },
        }}
      >
        {isSubmitting
          ? "Locking Legal Audit Log..."
          : "Submit Secure Compliance Proof"}
      </Button>
    </Box>
  );
}
