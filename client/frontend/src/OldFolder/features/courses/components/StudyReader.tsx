import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material";
import {
  NavigateNext as NextIcon,
  ArrowBack as BackIcon,
  MenuBook as BookIcon,
} from "@mui/icons-material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";

// 1. Mocking out study content that matches our course database
const MOCK_STUDY_CONTENT: Record<
  string,
  { title: string; sections: string[] }
> = {
  "course-1": {
    title: "Customer Service Excellence",
    sections: [
      "Welcome to Customer Service Excellence. As a frontline team member, you are the face of Adept. Your interactions directly shape our brand's reputation.",
      "The LAST Framework: When dealing with an upset customer on the floor, always apply the LAST principle: Listen fully without interrupting, Apologise sincerely for the inconvenience, Solve the problem immediately, and Thank them for bringing it to your attention.",
      "Active Communication: Body language matters as much as words. Maintain comfortable eye contact, stand with an open posture (no crossed arms), and use a calm, professional tone even under pressure.",
      "Upselling Techniques: Once a customer is satisfied with their core choice, gently mention a complementary item or current store promotion. Never be pushy; treat it as adding extra value to their visit.",
    ],
  },
  "course-2": {
    title: "Point of Sale (POS) Security",
    sections: [
      "Point of Sale terminals handle high volumes of transaction data daily. Safeguarding this space is vital to preventing financial register fraud.",
      "Password Integrity: Never share your POS login pin or password with any other employee, including managers. If a colleague needs to process a shift transaction, they must authenticate under their own credentials.",
      "Cash Handling Protocols: Always keep your register drawer firmly closed between transactions. Count change back to the customer deliberately to eliminate errors and verify large bills using the store's UV light detector.",
      "Reporting Variances: If you spot suspicious card reading attachments or calculate an unexplained discrepancy at cash drop time, lock the station down immediately and alert store security.",
    ],
  },
  "course-3": {
    title: "Basic Fire Safety & Evacuation",
    sections: [
      "Workplace safety is everyone's responsibility. Being prepared ensures you can guide customers safely out of the building during an emergency.",
      "Identifying Hazards: Keep fire exit pathways completely clear of bulk stock boxes and clothing racks at all times. A blocked exit is a critical compliance violation.",
      "The PASS Protocol: When using a fire extinguisher on a small localized flame, remember PASS: Pull the pin, Aim low at the base of the fire, Squeeze the handle lever, and Sweep side to side.",
      "Evacuation Leadership: If the main fire alarm triggers, stop all transactions instantly. Loudly and calmly direct all shoppers on your floor toward the nearest illuminated exit route. Assemble outside at the designated parking zone.",
    ],
  },
};

export const StudyReader: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Find the exact matching material bundle, or fallback gracefully if path is broken
  const courseData = MOCK_STUDY_CONTENT[courseId || ""] || {
    title: "Unknown Course",
    sections: [
      "Study material could not be found for this course registration code.",
    ],
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
        width: "100%",
      }}
    >
      <Container maxWidth="md">
        {/* Breadcrumb Navigation Shell for Instant Performance Pacing */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            component={RouterLink}
            to="/dashboard"
            color="inherit"
            underline="hover"
            sx={{ display: "flex", alignItems: "center", fontSize: "0.85rem" }}
          >
            <BackIcon sx={{ mr: 0.5, fontSize: "inherit" }} /> Dashboard
          </Link>
          <Typography
            color="text.primary"
            sx={{ fontSize: "0.85rem", fontWeight: "medium" }}
          >
            Study Room
          </Typography>
        </Breadcrumbs>

        {/* Core Document Reading Container */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Structural Title Block */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <BookIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" component="h1" fontWeight="bold">
                {courseData.title}
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{
                mb: 4,
                textTransform: "uppercase",
                tracking: 1,
                fontWeight: "bold",
              }}
            >
              Pre-Exam Preparation Reading
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* Content Section Blocks with optimized multi-sentence reading layouts */}
            <Stack spacing={4} sx={{ mb: 5 }}>
              {courseData.sections.map((paragraph, index) => (
                <Box key={index}>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Point {index + 1}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ lineHeight: 1.7, fontSize: "1.05rem" }}
                  >
                    {paragraph}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ mb: 4 }} />

            {/* The Ultimate Call to Action: The Quiz Trigger Button */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 2, maxWidth: "400px" }}
              >
                Done reading? Tap the button below when you're ready to prove
                your skills and complete this module.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<NextIcon />}
                onClick={() => navigate("/quiz")} // Routes directly to our performance quiz view
                sx={{
                  py: 1.8,
                  px: 5,
                  maxWidth: "350px",
                  width: "100%",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                  fontSize: "1rem",
                  boxShadow: 3,
                }}
              >
                Take Course Test
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
