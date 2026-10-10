import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CardMembership } from "@mui/icons-material";
import { SafetyQuizService } from "./services/safetyQuizService";
import type {
  IQuizTopicResponse,
  ICertificationResponse,
} from "./services/safetyQuizService";

// Feature Subcomponent Blocks
import QuizQuestionView from "./components/QuizQuestionView";
import CertificatesList from "./components/CertificatesList";
import OhsIntroCard from "./components/OhsIntroCard";
import AssignedQuizGrid from "./components/AssignedQuizGrid";

export default function QuizDashboardPage() {
  const [quizzes, setQuizzes] = useState<IQuizTopicResponse[]>([]);
  const [certificates, setCertificates] = useState<ICertificationResponse[]>(
    [],
  );
  const [activeQuiz, setActiveQuiz] = useState<IQuizTopicResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        const [quizData, certData] = await Promise.all([
          SafetyQuizService.getAvailableQuizzes(),
          SafetyQuizService.getMyCertificates().catch(() => []),
        ]);
        setQuizzes(quizData);
        setCertificates(certData);
      } catch (err: any) {
        setError(err.message || "Failed to sync safety data registers.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Early Return Layout: Interactive Assessment Step View
  if (activeQuiz) {
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
            {currentStep < totalQuestions && (
              <QuizQuestionView
                question={activeQuiz.questions[currentStep]}
                selectedOption={selectedOption}
                onSelectOption={setSelectedOption}
                currentQuestionIndex={currentStep}
                totalQuestions={totalQuestions}
                isLastQuestion={currentStep === totalQuestions - 1}
                onAdvance={() => {
                  if (currentStep < totalQuestions - 1) {
                    setCurrentStep((prev) => prev + 1);
                    setSelectedOption(null);
                  } else {
                    alert(
                      "🎉 Test Check Complete! Transitioning to Signature Canvas next.",
                    );
                    setActiveQuiz(null);
                    setCurrentStep(0);
                    setSelectedOption(null);
                  }
                }}
              />
            )}
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

  // Primary Landing UI Dashboard
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: "480px", md: "1200px" },
        mx: "auto",
      }}
    >
      <OhsIntroCard />

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

      {!isLoading && !error && (
        <>
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

          <AssignedQuizGrid quizzes={quizzes} onSelectQuiz={setActiveQuiz} />

          <Divider sx={{ my: 4, borderColor: "#e2e8f0" }} />

          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2.5, px: 0.5, alignItems: "center" }}
          >
            <CardMembership sx={{ color: "#10b981", fontSize: 20 }} />
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "uppercase",
                fontSize: "0.75rem",
                color: "text.secondary",
                fontWeight: "800",
              }}
            >
              Earned Safety Credentials & Badges
            </Typography>
          </Stack>

          <CertificatesList certificates={certificates} />
        </>
      )}
    </Box>
  );
}
