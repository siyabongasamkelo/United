import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useSafetyQuizEngine } from "../hooks/useSafetyQuizEngine";
import QuizQuestionView from "./QuizQuestionView";
import QuizSignaturePad from "./QuizSignaturePad";
import QuizResultBreakdown from "./QuizResultBreakdown";

interface SafetyQuizEngineProps {
  quizTopicId: string;
  onClose: () => void;
}

export default function SafetyQuizEngine({
  quizTopicId,
  onClose,
}: SafetyQuizEngineProps) {
  const q = useSafetyQuizEngine(quizTopicId);

  if (q.isLoading)
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 4 }}>
        Loading questionnaire modules...
      </Typography>
    );
  if (!q.quizData)
    return (
      <Alert severity="error">Training module could not be verified.</Alert>
    );

  const totalQuestions = q.quizData.questions.length;
  const isAnswering = q.currentStep < totalQuestions;
  const isSigning = q.currentStep === totalQuestions;
  const isShowingResults = q.currentStep === totalQuestions + 1;

  const progressPercent = (q.currentStep / totalQuestions) * 100;

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "680px", mx: "auto" }}>
      {/* PROGRESS HEADER TRACKER */}
      {isAnswering && (
        <Box sx={{ mb: 3, px: 0.5 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "800", color: "text.secondary" }}
            >
              TRAINING MODULE ASSIGNMENT: {q.quizData.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: "900", color: "#4f46e5" }}
            >
              Question {q.currentStep + 1} of {totalQuestions}
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
      )}

      {q.feedback && (
        <Alert
          severity={q.feedback.type}
          sx={{ mb: 3, borderRadius: 2, fontWeight: "600" }}
        >
          {q.feedback.msg}
        </Alert>
      )}

      {/* RENDER BOARD CONSOLE */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "#cbd5e1",
          bgcolor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {isAnswering && (
            <QuizQuestionView
              question={q.quizData.questions[q.currentStep]}
              selectedOption={q.selectedOption}
              onSelectOption={q.handleOptionSelect}
              onAdvance={q.advanceEngine}
              isLastQuestion={q.currentStep === totalQuestions - 1}
            />
          )}

          {isSigning && (
            <QuizSignaturePad
              canvasRef={q.canvasRef}
              isSubmitting={q.isSubmitting}
              onStartDrawing={q.startDrawing}
              onDraw={q.drawVector}
              onStopDrawing={q.stopDrawing}
              onClear={q.clearCanvas}
              onSubmit={q.executeFinalSubmission}
            />
          )}

          {isShowingResults && q.quizResult && (
            <QuizResultBreakdown result={q.quizResult} onClose={onClose} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
