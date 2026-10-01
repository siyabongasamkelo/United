import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Tabs, Tab } from "@mui/material";
import DailyTimeline from "./components/DailyTimeline";
import RosterBuilderForm from "./components/RosterBuilderForm"; // 💡 IMPORTED THE ALLOCATOR
import { mockWeeklyRoster } from "./data/mockRoster";

export default function ShiftRosterPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const currentDailyRoster = mockWeeklyRoster[activeTab] || mockWeeklyRoster[0];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "800px", mx: "auto" }}>
      {/* ❶ INTRODUCTORY PURPOSE CARD */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "#e2e8f0",
          bgcolor: "#ffffff",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            fontWeight="900"
            color="#1e1b4b"
            gutterBottom
          >
            Shift Roster & Deployment Matrix
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            Floor coverage must remain continuous. This dashboard acts as our
            centralized deployment axis to map our 12-man team across three
            staggered shift cycles, ensuring anchor bays at Game, Dis-Chem, and
            Clicks never drop down to an unstaffed state.
          </Typography>
        </CardContent>
      </Card>

      {/* ❷ ACTIVE WEEKDAY ROTATION STATUS READS */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {mockWeeklyRoster.map((item, idx) => (
              <Tab label={item.day} key={idx} />
            ))}
          </Tabs>
        </Box>
        <DailyTimeline roster={currentDailyRoster} />
      </Box>

      {/* ❸ INTERACTIVE ROSTER BUILDER ENGINE (NOW DROPPED EFFORTLESSLY AT THE BOTTOM) */}
      <Box sx={{ mt: 5 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          fontWeight="800"
          sx={{
            mb: 2,
            px: 0.5,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: "0.75rem",
          }}
        >
          Roster Generation Controls
        </Typography>
        <RosterBuilderForm />
      </Box>
    </Box>
  );
}
