import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  AssignmentTurnedIn,
  Shield,
  MenuBook,
  GppBad,
} from "@mui/icons-material";
import { SafetyQuizService } from "./services/safetyQuizService";
import type { IQuizTopicResponse } from "./services/safetyQuizService";

// 🚀 IMPORT YOUR BRAND NEW MULTI-CHOICE DISPLAY COMPONENT
import QuizQuestionView from "./components/QuizQuestionView";

export default function QuizDashboardPage() {
  const [quizzes, setQuizzes] = useState<IQuizTopicResponse[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<IQuizTopicResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active step and choice trackers for our live visual proofing run
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Sync available courses straight out of your Atlas cloud database on mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        const data = await SafetyQuizService.getAvailableQuizzes();
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message || "Failed to sync safety data registers.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // ❶ THE LIVE ACTIVE WIZARD RENDER SWITCHER
  if (activeQuiz) {
    const activeQuestion = activeQuiz.questions[currentStep];
    const totalQuestions = activeQuiz.questions.length;

    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "680px", mx: "auto", mt: 4 }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: "#cbd5e1",
            bgcolor: "#ffffff",
            p: { xs: 1, sm: 2 },
          }}
        >
          <CardContent>
            {currentStep < totalQuestions ? (
              <QuizQuestionView
                question={activeQuestion}
                selectedOption={selectedOption}
                onSelectOption={(letter) => setSelectedOption(letter)}
                currentQuestionIndex={currentStep}
                totalQuestions={totalQuestions}
                isLastQuestion={currentStep === totalQuestions - 1}
                onAdvance={() => {
                  if (currentStep < totalQuestions - 1) {
                    setCurrentStep((prev) => prev + 1);
                    setSelectedOption(null); // Reset selection flag for the next step index
                  } else {
                    alert(
                      "🎉 Test Check Complete! Transitioning smoothly to Legal Signature Canvas next.",
                    );
                    // Reset local test run tracking states gracefully
                    setActiveQuiz(null);
                    setCurrentStep(0);
                    setSelectedOption(null);
                  }
                }}
              />
            ) : null}
          </CardContent>
        </Card>
        <Button
          variant="text"
          onClick={() => {
            setActiveQuiz(null);
            setCurrentStep(0);
            setSelectedOption(null);
          }}
          sx={{
            mt: 3,
            color: "#64748b",
            textTransform: "none",
            fontWeight: "700",
          }}
        >
          ← Cancel and Return to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: "480px", md: "1200px" },
        mx: "auto",
      }}
    >
      {/* MISSION CONTROL OHS ACT INTRO CARD */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "#e2e8f0",
          bgcolor: "#ffffff",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mb: 2, alignItems: "center" }}
          >
            <Shield sx={{ color: "#1e1b4b", fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: "900", color: "#1e1b4b" }}
            >
              Occupational Health & Safety Competency
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            Compliance with the{" "}
            <strong>
              Department of Employment and Labour (OHS Act 85 of 1993)
            </strong>{" "}
            requires continuous operational tracking.
          </Typography>
        </CardContent>
      </Card>

      <Typography
        variant="subtitle2"
        sx={{
          mb: 2.5,
          px: 0.5,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          color: "text.secondary",
          fontWeight: "800",
        }}
      >
        Assigned Safety Matrices
      </Typography>

      {/* COMPILER DATA LOADING LOADING WRAPPERS */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
            gap: 2,
            alignItems: "center",
          }}
        >
          <CircularProgress size={24} sx={{ color: "#1e1b4b" }} />
          <Typography variant="body2" color="text.secondary">
            Loading active safety registries...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* THE MAIN ACTIVE HAZARD CHECKLIST MATRICES LOOP */}
      {!isLoading && !error && (
        <Grid container spacing={3}>
          {quizzes.map((quiz) => {
            const isHighRisk = quiz.hazardLevel === "HIGH";
            const isMediumRisk = quiz.hazardLevel === "MEDIUM";
            const badgeColor = isHighRisk
              ? "error"
              : isMediumRisk
                ? "warning"
                : "info";

            return (
              <Grid key={quiz._id} xs={12} sm={6} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    borderColor: "#e2e8f0",
                    bgcolor: "#ffffff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={`${quiz.hazardLevel} RISK`}
                        size="small"
                        color={badgeColor}
                        sx={{
                          fontWeight: "800",
                          fontSize: "0.7rem",
                          borderRadius: 1.5,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontWeight: "700" }}
                      >
                        Pass bar: {quiz.passingScorePercentage}%
                      </Typography>
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#1e1b4b", fontWeight: "900", mb: 1 }}
                    >
                      {quiz.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.85rem", lineHeight: 1.5, mb: 3 }}
                    >
                      {quiz.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                        mb: 3,
                      }}
                    >
                      <MenuBook sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: "700" }}>
                        Contains {quiz.questions.length} Audit Parameters
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<AssignmentTurnedIn />}
                      onClick={() => setActiveQuiz(quiz)} // Inject the whole object straight into local focus states
                      sx={{
                        bgcolor: "#1e1b4b",
                        fontWeight: "800",
                        textTransform: "none",
                        py: 1,
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#2e2a72" },
                      }}
                    >
                      Begin Compliance Audit
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
