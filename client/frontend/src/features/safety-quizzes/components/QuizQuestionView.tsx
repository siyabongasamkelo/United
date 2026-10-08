import { Box, Typography, Button, Stack, LinearProgress } from "@mui/material";
// 🚫 REMOVE THE OLD IMPORT:
// import { Checklist, ArrowForward, ShieldAlert } from "@mui/icons-material";

//  ADD THIS INSTEAD (Using GppBad for the security shield alert):
import { Checklist, ArrowForward, GppBad } from "@mui/icons-material";
import type { IQuizQuestion } from "../services/safetyQuizService";

interface QuizQuestionViewProps {
  question: IQuizQuestion;
  selectedOption: string | null;
  onSelectOption: (letter: string) => void;
  onAdvance: () => void;
  isLastQuestion: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export default function QuizQuestionView({
  question,
  selectedOption,
  onSelectOption,
  onAdvance,
  isLastQuestion,
  currentQuestionIndex,
  totalQuestions,
}: QuizQuestionViewProps) {
  // Compute precision progress bars coordinates metrics on the canvas array natively
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Box>
      {/* ❶ TOP TELEMETRY TRACKER GRID */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          sx={{
            mb: 1.5,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Checklist sx={{ color: "#4f46e5", fontSize: 20 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: "800",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Active Hazard Audit Check
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              fontWeight: "900",
              color: "#4f46e5",
              bgcolor: "#f5f3ff",
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
            }}
          >
            Parameter {currentQuestionIndex + 1} of {totalQuestions}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "#f1f5f9",
            "& .MuiLinearProgress-bar": { bgcolor: "#4f46e5" },
          }}
        />
      </Box>

      {/* ❷ TARGET QUESTION LOG CANVAS ROW */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "800",
          color: "#0f172a",
          mb: 4,
          fontSize: "1.2rem",
          lineHeight: 1.6,
        }}
      >
        {question.questionText}
      </Typography>

      {/* ❸ MULTI-CHOICE STRIP OPTION MATRICES */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {question.options.map((opt) => {
          // Extract leading string character boundary context securely (e.g., "A", "B", "C", "D")
          const letterPrefix = opt.trim().charAt(0).toUpperCase();
          const isSelected = selectedOption === letterPrefix;

          return (
            <Button
              key={opt}
              variant={isSelected ? "contained" : "outlined"}
              fullWidth
              onClick={() => onSelectOption(letterPrefix)}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: "700",
                py: 2,
                px: 3,
                borderRadius: 2.5,
                textAlign: "left",
                fontSize: "0.95rem",
                bgcolor: isSelected ? "#1e1b4b" : "#ffffff",
                color: isSelected ? "#ffffff" : "#334155",
                borderColor: isSelected ? "#1e1b4b" : "#e2e8f0",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(30, 27, 75, 0.15)"
                  : "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: isSelected ? "#2e2a72" : "#f8fafc",
                  borderColor: isSelected ? "#2e2a72" : "#cbd5e1",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {opt}
            </Button>
          );
        })}
      </Stack>

      {/* ❹ ACTION EXECUTION TRANSITION FOOTER */}
      <Button
        variant="contained"
        fullWidth
        endIcon={<ArrowForward />}
        onClick={onAdvance}
        disabled={!selectedOption} // Strict OHS compliance guard: lock navigation until an option is selected
        sx={{
          py: 1.75,
          borderRadius: 2.5,
          fontWeight: "800",
          textTransform: "none",
          fontSize: "1rem",
          bgcolor: "#1e1b4b",
          boxShadow: "0 4px 12px rgba(30, 27, 75, 0.1)",
          "&:hover": {
            bgcolor: "#2e2a72",
          },
          "&:disabled": {
            bgcolor: "#e2e8f0",
            color: "#94a3b8",
          },
        }}
      >
        {isLastQuestion
          ? "Proceed to Legal Sign-off"
          : "Confirm & Next Question"}
      </Button>

      {/* ❺ LEGAL NOTICE BASEBOARD INFRASTRUCTURE */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 3,
          opacity: 0.6,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GppBad sx={{ fontSize: 15, color: "#64748b" }} />
        <Typography
          variant="caption"
          sx={{ color: "#64748b", fontWeight: "600" }}
        >
          OHS Act 85 of 1993 Secure Hydration Log Track
        </Typography>
      </Stack>
    </Box>
  );
}
