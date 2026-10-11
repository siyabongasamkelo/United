import { useState, useEffect } from "react";
import {
  Box,
  Button,
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
import CertificatesList from "./components/CertificatesList";
import OhsIntroCard from "./components/OhsIntroCard";
import AssignedQuizGrid from "./components/AssignedQuizGrid";
// ✅ FIXED: Imported the core production engine wrapper instead of the raw isolated sub-view
import SafetyQuizEngine from "./components/SafetyQuizEngine";

export default function QuizDashboardPage() {
  const [quizzes, setQuizzes] = useState<IQuizTopicResponse[]>([]);
  const [certificates, setCertificates] = useState<ICertificationResponse[]>(
    [],
  );
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Re-usable data refresh function so completing a quiz instantly shows the new certificate badge!
  const refreshDashboardData = async () => {
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
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  // ✅ FIXED: If a quiz is selected, mount the true multi-stage production audit workspace
  if (activeQuizId) {
    return (
      <Box sx={{ mt: 2 }}>
        <SafetyQuizEngine
          quizTopicId={activeQuizId}
          onClose={() => {
            setActiveQuizId(null);
            refreshDashboardData(); // Refresh logs to draw new badges cleanly instantly!
          }}
        />
        <Box sx={{ maxWidth: "680px", mx: "auto", px: { xs: 2, sm: 4 } }}>
          <Button
            variant="text"
            onClick={() => setActiveQuizId(null)}
            sx={{
              mt: 1,
              color: "#64748b",
              textTransform: "none",
              fontWeight: "700",
            }}
          >
            ← Abandon Audit and Return to Dashboard
          </Button>
        </Box>
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

      {isLoading && !quizzes.length && (
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

      {(!isLoading || !!quizzes.length) && !error && (
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

          {/* ✅ FIXED: Map the grid select triggers straight to the quiz configuration document identifier */}
          <AssignedQuizGrid
            quizzes={quizzes}
            onSelectQuiz={(quiz) => setActiveQuizId(quiz._id)}
          />

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
