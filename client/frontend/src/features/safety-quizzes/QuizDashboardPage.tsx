// 📂 File: src/features/safety-quizzes/QuizDashboardPage.tsx
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react"; // 🚀 Switch to useClerk to match reference code blueprint
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
import { api } from "../../shared/api/axiosInstance";
import { SafetyQuizService } from "./services/safetyQuizService";
import type {
  IQuizTopicResponse,
  ICertificationResponse,
} from "./services/safetyQuizService";

import CertificatesList from "./components/CertificatesList";
import OhsIntroCard from "./components/OhsIntroCard";
import AssignedQuizGrid from "./components/AssignedQuizGrid";
import SafetyQuizEngine from "./components/SafetyQuizEngine";

export default function QuizDashboardPage() {
  // 🚀 Use the exact hook instance layout from manager console
  const clerk = useClerk();

  const [quizzes, setQuizzes] = useState<IQuizTopicResponse[]>([]);
  const [certificates, setCertificates] = useState<ICertificationResponse[]>(
    [],
  );
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🚀 Exact boolean login guard formula from your reference file
  const isOperatorLoggedIn = !!clerk.session && !!clerk.user?.id;

  useEffect(() => {
    // 🛑 Brick wall guard check matching the reference hook loop
    if (!isOperatorLoggedIn) {
      return;
    }

    const refreshDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 🚀 THE BLOCKING HANDSHAKE: Force token extraction from clerk session object
        if (clerk.session) {
          const token = await clerk.session.getToken();
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        const [quizData, certData] = await Promise.all([
          SafetyQuizService.getAvailableQuizzes(),
          SafetyQuizService.getMyCertificates().catch(() => []),
        ]);

        setQuizzes(quizData);
        setCertificates(certData);
        console.log("quiz data", quizData);
      } catch (err: any) {
        console.error("Safety Dashboard Sync failure:", err);
        setError(err.message || "Failed to sync safety data registers.");
      } finally {
        setIsLoading(false);
      }
    };

    refreshDashboardData();
    // 🚀 Listen directly to the exact login state value from your reference hook!
  }, [isOperatorLoggedIn]);

  // If an active questionnaire is selected, mount the production audit workspace
  if (activeQuizId) {
    return (
      <Box sx={{ mt: 2 }}>
        <SafetyQuizEngine
          quizTopicId={activeQuizId}
          onClose={() => {
            setActiveQuizId(null);
            if (isOperatorLoggedIn) {
              setIsLoading(true);
              Promise.all([
                SafetyQuizService.getAvailableQuizzes(),
                SafetyQuizService.getMyCertificates().catch(() => []),
              ])
                .then(([quizData, certData]) => {
                  setQuizzes(quizData);
                  setCertificates(certData);
                  setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
            }
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

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: { xs: "480px", md: "1200px" },
        mx: "auto",
      }}
    >
      <OhsIntroCard />

      {/* Show indicator if either our custom states or Clerk is still initializing */}
      {(isLoading || !isOperatorLoggedIn) && !quizzes.length && (
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

      {isOperatorLoggedIn && !isLoading && (
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
