import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  MenuBook as StudyIcon,
  CheckCircle as CompletedIcon,
  PlayArrow as StartIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// 1. Structural Course Data Definition
interface Course {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  progress: number; // percentage 0 - 100
  duration: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Customer Service Excellence",
    description:
      "Learn the core communication frameworks to handle floor queries and boost retail sales.",
    status: "in_progress",
    progress: 65,
    duration: "15 mins",
  },
  {
    id: "course-2",
    title: "Point of Sale (POS) Security",
    description:
      "Crucial compliance guidelines for processing transactions securely and avoiding register fraud.",
    status: "not_started",
    progress: 0,
    duration: "10 mins",
  },
  {
    id: "course-3",
    title: "Basic Fire Safety & Evacuation",
    description:
      "Workplace readiness drills, exit routes management, and urgent emergency response protocols.",
    status: "completed",
    progress: 100,
    duration: "5 mins",
  },
];

export const CourseDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Helper engine to output dynamic color configurations for our status chips
  const getStatusChip = (status: Course["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Chip
            icon={<CompletedIcon />}
            label="Completed"
            color="success"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      case "in_progress":
        return (
          <Chip
            label="In Progress"
            color="primary"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      default:
        return (
          <Chip
            label="Not Started"
            variant="outlined"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 2,
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        {/* Dashboard Header Greetings Section */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Welcome Back, Team Member
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete your assigned training modules to unlock certificates and
            update your manager.
          </Typography>
        </Box>

        {/* Responsive Grid Architecture */}
        <Grid container spacing={3}>
          {MOCK_COURSES.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Meta row containing Status Tag and Duration info */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    {getStatusChip(course.status)}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="medium"
                    >
                      {course.duration}
                    </Typography>
                  </Stack>

                  {/* Course Context Titles */}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    component="h2"
                    sx={{ mb: 1, lineHeight: 1.3 }}
                  >
                    {course.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.description}
                  </Typography>

                  {/* Byte-sized Performance Progress Tracker */}
                  {course.status !== "not_started" && (
                    <Box sx={{ mt: "auto" }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          color="primary"
                        >
                          {course.progress}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{ borderRadius: 1, height: 6 }}
                      />
                    </Box>
                  )}
                </CardContent>

                {/* Adaptive Action Call Buttons at the base card edge */}
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant={
                      course.status === "completed" ? "outlined" : "contained"
                    }
                    fullWidth
                    startIcon={
                      course.status === "completed" ? (
                        <StudyIcon />
                      ) : (
                        <StartIcon />
                      )
                    }
                    onClick={() => navigate(`/course/${course.id}/study`)}
                    sx={{
                      py: 1.2,
                      textTransform: "none",
                      fontWeight: "bold",
                      borderRadius: 2,
                    }}
                  >
                    {course.status === "completed"
                      ? "Review Material"
                      : course.status === "in_progress"
                        ? "Resume Course"
                        : "Start Learning"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
