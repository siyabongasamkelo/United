import { Box, Typography, Button, Stack, Grid } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import type { IQuizAttemptResponse } from "../services/safetyQuizService";

interface QuizResultBreakdownProps {
  result: IQuizAttemptResponse;
  onClose: () => void;
}

export default function QuizResultBreakdown({
  result,
  onClose,
}: QuizResultBreakdownProps) {
  return (
    <Box>
      {/* SCORE CARD HEADER */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        {result.hasPassed ? (
          <CheckCircle sx={{ color: "success.main", fontSize: 60, mb: 1 }} />
        ) : (
          <Cancel sx={{ color: "error.main", fontSize: 60, mb: 1 }} />
        )}
        <Typography variant="h5" sx={{ fontWeight: "900", color: "#1e1b4b" }}>
          {result.hasPassed
            ? "Training Module Compliant"
            : "Passing Threshold Not Achieved"}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "900",
            color: result.hasPassed ? "success.main" : "error.main",
            my: 2,
          }}
        >
          {result.percentageScore}%
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "600" }}
        >
          Score calculation: {result.score} / {result.totalQuestions} answers
          correct
        </Typography>
      </Box>

      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          fontWeight: "800",
          color: "text.secondary",
        }}
      >
        Detailed Audit Response Review
      </Typography>

      {/* ⚡ THE OVERLAP FIX: Added a contained scroll window for extensive text lists */}
      <Stack
        spacing={3}
        sx={{
          mb: 4,
          maxHeight: "420px",
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#cbd5e1",
            borderRadius: "3px",
          },
        }}
      >
        {result.breakdown.map((item, idx) => (
          <Box
            key={item.questionId}
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: item.isCorrect ? "#e2e8f0" : "#fee2e2",
              bgcolor: item.isCorrect ? "#ffffff" : "#fffbfa",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "800", color: "#0f172a", mb: 1.5 }}
            >
              {idx + 1}. {item.questionText}
            </Typography>

            <Grid container spacing={1} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 6 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontWeight: "600",
                  }}
                >
                  Your Submission:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: "800",
                    color: item.isCorrect ? "success.main" : "error.main",
                  }}
                >
                  Option {item.selectedAnswer}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontWeight: "600",
                  }}
                >
                  Correct Blueprint:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "800", color: "success.main" }}
                >
                  Option {item.correctAnswer}
                </Typography>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 1,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: "#f8fafc",
                borderLeft: "3px solid #64748b",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#334155",
                  display: "block",
                  lineHeight: 1.5,
                  fontWeight: "500",
                }}
              >
                <strong>Safety Memo:</strong> {item.explanation}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>

      <Button
        variant="outlined"
        fullWidth
        onClick={onClose}
        sx={{
          textTransform: "none",
          fontWeight: "800",
          borderRadius: 2,
          color: "#1e1b4b",
          borderColor: "#cbd5e1",
        }}
      >
        Return to Safety Dashboard
      </Button>
    </Box>
  );
}
