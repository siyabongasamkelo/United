import {
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Typography,
  Button,
} from "@mui/material";
import { MenuBook, AssignmentTurnedIn } from "@mui/icons-material";
import type { IQuizTopicResponse } from "../services/safetyQuizService";

interface AssignedQuizGridProps {
  quizzes: IQuizTopicResponse[];
  onSelectQuiz: (quiz: IQuizTopicResponse) => void;
}

export default function AssignedQuizGrid({
  quizzes,
  onSelectQuiz,
}: AssignedQuizGridProps) {
  return (
    <Grid container spacing={3} sx={{ mb: 6 }}>
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
                  onClick={() => onSelectQuiz(quiz)}
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
  );
}
