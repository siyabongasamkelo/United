import { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  CardMedia,
} from "@mui/material";
import { ExpandMore, AssignmentInd } from "@mui/icons-material";
import { onboardingLessons } from "../data/lessons";

export default function LessonConsole() {
  // Keeps track of which panel is currently open (helps with managing state if needed)
  const [expanded, setExpanded] = useState<string | false>("panel-1");

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      <Typography
        sx={{
          mb: 2,
          px: 0.5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontSize: "0.75rem",
          variant: "subtitle2",
          color: "text.secondary",
          fontWeight: "800",
        }}
      >
        Active Onboarding Modules
      </Typography>

      {/* Map through all 10 lessons dynamically */}
      {onboardingLessons.map((lesson) => {
        const panelId = `panel-${lesson.id}`;

        return (
          <Accordion
            key={lesson.id}
            expanded={expanded === panelId}
            onChange={handleChange(panelId)}
            disableGutters
            elevation={0}
            variant="outlined"
            sx={{
              borderRadius: "12px !important",
              overflow: "hidden",
              borderColor: "#e2e8f0",
              mb: 2, // Space between different accordion items
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            {/* Accordion Title Header */}
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: "#1e1b4b" }} />}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AssignmentInd sx={{ color: "#4f46e5", fontSize: 20 }} />
                <Typography
                  sx={{ variant: "body2", fontWeight: "800", color: "#1e1b4b" }}
                >
                  {lesson.topicNumber}: {lesson.title}
                </Typography>
              </Box>
            </AccordionSummary>

            {/* Collapsable Content Panel */}
            <AccordionDetails
              sx={{ bgcolor: "#fcfcfd", borderTop: "1px solid #e2e8f0", p: 0 }}
            >
              {/* 📸 MUI CARD MEDIA: Only renders/displays visibly when this specific panel is opened */}
              <CardMedia
                component="img"
                height="220"
                image={lesson.image}
                alt={lesson.title}
                sx={{
                  objectFit: "cover",
                  borderBottom: "1px solid #e2e8f0",
                }}
              />

              {/* Text Descriptions */}
              <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
                {lesson.subTopics.map((sub, sIdx) => (
                  <Box key={sIdx} sx={{ mb: 3, "&:last-child": { mb: 0 } }}>
                    {/* Sub-Header Title */}
                    <Typography
                      sx={{
                        mb: 1,
                        variant: "body2",
                        fontWeight: "800",
                        color: "#1e1b4b",
                      }}
                    >
                      {sub.title}
                    </Typography>

                    {/* Bullet Points */}
                    <Box
                      component="ul"
                      sx={{ m: 0, pl: 2, listStyleType: "disc" }}
                    >
                      {sub.points.map((pt, pIdx) => (
                        <Box
                          component="li"
                          key={pIdx}
                          sx={{
                            mb: 1,
                            color: "#475569",
                            fontSize: "0.85rem",
                            lineHeight: 1.6,
                          }}
                        >
                          <strong>{pt.label}:</strong> {pt.text}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
