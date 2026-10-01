import React, { useState } from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import { Map } from "@mui/icons-material";

export default function AxisMap() {
  const [activeParking, setActiveParking] = useState<string>(
    "Click a store below to see proximity",
  );

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: "#e2e8f0",
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        position: { md: "sticky" },
        top: "100px", // Pinned cleanly below our sticky header on PC
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Map sx={{ color: "#4f46e5", fontSize: 20 }} />
          <Typography variant="subtitle2" fontWeight="700" color="text.primary">
            The UTS Floor Axis (Anchor Map)
          </Typography>
        </Box>

        {/* Axis Timeline Line Diagram */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            my: 2.5,
            px: 1,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "10%",
              right: "10%",
              height: "2px",
              bgcolor: "#cbd5e1",
              zIndex: 1,
            }}
          />

          <Box sx={{ zIndex: 2 }}>
            <Button
              onClick={() =>
                setActiveParking("Parking A is closest to Dis-Chem")
              }
              size="small"
              variant="outlined"
              sx={{
                bgcolor: "#ffffff",
                color: "#1e293b",
                fontWeight: "bold",
                borderColor: "#cbd5e1",
                textTransform: "none",
                px: 1.5,
                fontSize: "0.75rem",
              }}
            >
              Dis-Chem
            </Button>
          </Box>

          <Box sx={{ zIndex: 2 }}>
            <Button
              onClick={() =>
                setActiveParking("Parking B (Drop-Off) is right next to Clicks")
              }
              size="small"
              variant="outlined"
              sx={{
                bgcolor: "#ffffff",
                color: "#1e293b",
                fontWeight: "bold",
                borderColor: "#cbd5e1",
                textTransform: "none",
                px: 1.5,
                fontSize: "0.75rem",
              }}
            >
              Clicks
            </Button>
          </Box>

          <Box sx={{ zIndex: 2 }}>
            <Button
              onClick={() =>
                setActiveParking("Parkings E & G are closest to Game")
              }
              size="small"
              variant="contained"
              sx={{
                bgcolor: "#4f46e5",
                color: "#ffffff",
                fontWeight: "extrabold",
                textTransform: "none",
                px: 1.5,
                fontSize: "0.75rem",
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              ★ GAME
            </Button>
          </Box>
        </Box>

        {/* Indicator Box */}
        <Box
          sx={{
            bgcolor: "#f1f5f9",
            p: 1.2,
            borderRadius: 2,
            textAlign: "center",
            border: "1px dashed #cbd5e1",
          }}
        >
          <Typography
            variant="caption"
            fontWeight="700"
            color="primary.main"
            sx={{ display: "block" }}
          >
            {activeParking}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
