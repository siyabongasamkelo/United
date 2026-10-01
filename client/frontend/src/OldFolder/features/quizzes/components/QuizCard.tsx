import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material";
import {
  CheckCircle as CorrectIcon,
  NavigateNext as NextIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

// 1. Mocking the structural data shape we will get from QuizAPI later
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Which HTML5 element is used to display video files natively?",
    category: "HTML",
    difficulty: "Easy",
    answers: ["<media>", "<video>", "<movie>", "<play>"],
    correct_answer: "<video>",
  },
  {
    id: 2,
    question:
      "What does the 'S' stand for in the SOLID principles of software design?",
    category: "Architecture",
    difficulty: "Medium",
    answers: ["Structural", "Sequential", "Single Responsibility", "Stateful"],
    correct_answer: "Single Responsibility",
  },
];

export const QuizCard: React.FC = () => {
  // 2. Active Quiz State Management
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestionData = MOCK_QUESTIONS[currentStep];
  const totalQuestions = MOCK_QUESTIONS.length;

  // Calculate our Electric Indigo progress bar percentage dynamically (0% to 100%)
  const progressPercentage = ((currentStep + 1) / totalQuestions) * 100;

  // 3. Selection & Progression Handling
  const handleSelectOption = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    // Track score if the choice matches the backend answer sheet
    if (selectedAnswer === currentQuestionData.correct_answer) {
      setScore((prev) => prev + 1);
    }

    if (currentStep + 1 < totalQuestions) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null); // Reset choice target for the next card slot
    } else {
      setQuizFinished(true);
      toast.success("Quiz completed! Great job elevating your skills.");
    }
  };

  const handleResetQuiz = () => {
    setCurrentStep(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  // 4. Render State: Summary View (Once complete)
  if (quizFinished) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          bgcolor: "background.default",
          px: 2,
          boxSizing: "border-box",
        }}
      >
        <Card
          sx={{
            maxWidth: 450,
            width: "100%",
            borderRadius: 3,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <CorrectIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quiz Completed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You scored **{score} out of {totalQuestions}** correct. Keep
              learning to level up.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleResetQuiz}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // 5. Main Render State: Single Question Active Layout
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        bgcolor: "background.default",
        px: 2,
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          boxShadow: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blazing Fast Linear Progress Tracker */}
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ height: 6 }}
        />

        <CardContent sx={{ p: 4 }}>
          {/* Metadata Meta-Row via Chip Components */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label={currentQuestionData.category}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: "medium" }}
            />
            <Chip
              label={currentQuestionData.difficulty}
              size="small"
              color="secondary"
              sx={{ fontWeight: "medium" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ marginLeft: "auto !important", alignSelf: "center" }}
            >
              Question {currentStep + 1} of {totalQuestions}
            </Typography>
          </Stack>

          {/* Question Presentation Header */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 4, minHeight: "60px", lineHeight: 1.4 }}
          >
            {currentQuestionData.question}
          </Typography>

          {/* Large Touch-Friendly Answer Target Stack */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            {currentQuestionData.answers.map((answer) => {
              const isSelected = selectedAnswer === answer;
              return (
                <Button
                  key={answer}
                  variant={isSelected ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => handleSelectOption(answer)}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    py: 1.8,
                    px: 3,
                    borderRadius: 2,
                    fontSize: "0.95rem",
                    fontWeight: isSelected ? "bold" : "medium",
                    // Smooth, byte-sized style adjustments matching selected state
                    borderColor: isSelected ? "primary.main" : "divider",
                    color: isSelected ? "white" : "text.primary",
                    backgroundColor: isSelected
                      ? "primary.main"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? "primary.dark"
                        : "action.hover",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  {answer}
                </Button>
              );
            })}
          </Stack>

          {/* Navigational Trigger Control */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={!selectedAnswer}
            onClick={handleNextQuestion}
            endIcon={<NextIcon />}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {currentStep + 1 === totalQuestions
              ? "Finish Quiz"
              : "Next Question"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
