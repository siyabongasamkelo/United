import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import {
  TrendingDown,
  TrendingUp,
  TrendingFlat,
  Storefront,
} from "@mui/icons-material";
import { mockStoreAudits } from "../data/mockAudits";
import type { StoreAudit } from "../data/mockAudits"; // 💡 Separated type indicator

interface StoreAuditCardProps {
  audit: StoreAudit;
}

export default function StoreAuditCard({ audit }: StoreAuditCardProps) {
  // Determine delta color and icons dynamically
  const isLoss = audit.weeklyDelta < 0;
  const isGain = audit.weeklyDelta > 0;

  const deltaColor = isLoss
    ? "error.main"
    : isGain
      ? "success.main"
      : "text.secondary";
  const deltaBg = isLoss ? "#fef2f2" : isGain ? "#f0fdf4" : "#f1f5f9";

  const DeltaIcon = isLoss ? TrendingDown : isGain ? TrendingUp : TrendingFlat;

  // Calculate clean, operational active fleet numbers
  const activeDeployment =
    audit.totalTrolleys - (audit.damagedCount + audit.dirtyCount);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: "#e2e8f0",
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Block: Store Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Storefront sx={{ color: "#1e1b4b", fontSize: 20 }} />
          <Typography
            variant="subtitle1"
            fontWeight="900"
            color="#1e1b4b"
            sx={{ letterSpacing: 0.2 }}
          >
            {audit.storeName}
          </Typography>
        </Box>

        {/* Big Numbers Layer */}
        <Stack
          direction="row"
          alignItems="baseline"
          spacing={1.5}
          sx={{ mb: 1 }}
        >
          <Typography variant="h3" fontWeight="900" color="#0f172a">
            {audit.totalTrolleys}
          </Typography>
          <Typography variant="caption" fontWeight="700" color="text.secondary">
            total fleet units
          </Typography>
        </Stack>

        {/* Dynamic Delta Badge: Shows exactly what changed from last week */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            bgcolor: deltaBg,
            mb: 2.5,
          }}
        >
          <DeltaIcon sx={{ color: deltaColor, fontSize: 16 }} />
          <Typography variant="caption" fontWeight="800" color={deltaColor}>
            {isLoss ? "" : isGain ? "+" : ""}
            {audit.weeklyDelta} units ({audit.deltaPercentage}%) vs last week
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed", my: 1.5 }} />

        {/* Operational Status Section */}
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight="800"
          sx={{ display: "block", mb: 1, textTransform: "uppercase" }}
        >
          Current Status Breakdown
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ gap: 1 }}
        >
          <Chip
            label={`${activeDeployment} Active`}
            size="small"
            sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: "700" }}
          />
          <Chip
            label={`${audit.damagedCount} Damaged`}
            size="small"
            variant="outlined"
            color="error"
            sx={{ fontWeight: "700" }}
          />
          <Chip
            label={`${audit.dirtyCount} Too Dirty`}
            size="small"
            variant="outlined"
            color="warning"
            sx={{ fontWeight: "700" }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
