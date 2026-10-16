// 📂 File: src/features/manager-console/components/TerritoryCard.tsx
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { LocalMall } from "@mui/icons-material";
import type { IAreaBranchResponse } from "../services/managerConsoleService";

interface TerritoryCardProps {
  branch: IAreaBranchResponse;
  onClick: () => void;
}

export function TerritoryCard({ branch, onClick }: TerritoryCardProps) {
  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        borderRadius: 3,
        borderColor: "#e2e8f0",
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        height: "100%",
        cursor: "pointer",
        transition:
          "transform 0.15s ease-in-out, border-color 0.15s ease-in-out",
        "&:hover": {
          borderColor: "#4f46e5",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <LocalMall sx={{ color: "#1e1b4b", fontSize: 20 }} />
          <Typography
            variant="subtitle1"
            sx={{ letterSpacing: 0.2, color: "#1e1b4b", fontWeight: "900" }}
          >
            {branch.name}
          </Typography>
        </Box>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{ color: "#64748b", fontWeight: "600" }}
          >
            District Unit:{" "}
            <strong>{branch.area?.name || "Unassigned Region"}</strong>
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#64748b", fontWeight: "600" }}
          >
            Hub Manager:{" "}
            <strong>
              {branch.contacts?.branchManager?.name || "None Assigned"}
            </strong>
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#64748b", fontWeight: "600" }}
          >
            Type:{" "}
            <strong style={{ textTransform: "uppercase" }}>
              {branch.config?.branchType}
            </strong>
          </Typography>
        </Stack>

        <Divider sx={{ borderStyle: "dashed", my: 2 }} />

        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: "900", color: "#16a34a" }}
            >
              {branch.config?.hasRepairFacility ? "YES" : "NO"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: "700", color: "text.secondary" }}
            >
              Repair Bay On-Site
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "900", color: "#0f172a" }}
            >
              {branch.branchCode}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: "700", color: "text.secondary" }}
            >
              Terminal Hub Routing Code
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
