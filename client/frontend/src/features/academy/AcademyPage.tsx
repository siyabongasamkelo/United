import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import LessonConsole from "./components/LessonConsole";

export default function AcademyPage() {
  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "800px", mx: "auto" }}>
      {/* ❶ THE WELCOME & PURPOSE INTRODUCTION */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "#cbd5e1",
          bgcolor: "#ffffff",
          mb: 4,
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            fontWeight="900"
            color="#1e1b4b"
            gutterBottom
            sx={{ letterSpacing: -0.5 }}
          >
            Welcome to the UTS Team Floor Portal
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            We created this hub for one simple reason:{" "}
            <strong>your time and energy are valuable</strong>. Gateway Mall is
            massive, and we don't want you spending your first few shifts
            feeling lost, confused, or frustrated. This isn't about giving you a
            list of rules to memorize as a punishment—it is about giving you the
            exact shortcuts to succeed immediately.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            As a UTS Trolley Porter, you are the face of our company on the
            floor. When you handle our equipment properly, keep transit lanes
            clear, and coordinate smoothly with stores like Game, Dis-Chem, and
            Clicks, you prevent expensive damage and save the team hours of
            wasted effort.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Take five minutes to look through the active training modules below
            before you start your shift. Once you understand these core moves,
            you'll be able to hit the floor with total confidence, protect
            company assets, and show exactly why you belong on this elite team.
            Let's get to work!
          </Typography>
        </CardContent>
      </Card>

      {/* ❷ THE LESSONS CONSOLE CONTAINER */}
      <Box>
        <LessonConsole />
      </Box>
    </Box>
  );
}
