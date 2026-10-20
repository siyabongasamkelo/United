import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { AccountBalanceWallet, WarningAmber } from "@mui/icons-material";

interface FinancialLossCardProps {
  lostCount: number;
  brokenCount: number;
}

export function FinancialLossCard({
  lostCount,
  brokenCount,
}: FinancialLossCardProps) {
  const COST_PER_TROLLEY = 3500;
  const REPAIR_AVG_COST = 850;

  const directLostCost = lostCount * COST_PER_TROLLEY;
  const directRepairCost = brokenCount * REPAIR_AVG_COST;
  const totalDirectLoss = directLostCost + directRepairCost;

  // Compounded Projection Logic (Annualizing the burn rate out 12 periods)
  const projectedAnnualBurn = totalDirectLoss * 12;

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: "#cbd5e1", height: "100%" }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AccountBalanceWallet sx={{ color: "#dc2626", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Direct Capital Damage Report
          </Typography>
        </Box>

        <Stack spacing={1.5} sx={{ my: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "600", color: "#475569" }}
            >
              Lost Replacement Cost
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "800", color: "#0f172a" }}
            >
              R {directLostCost.toLocaleString("en-ZA")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "600", color: "#475569" }}
            >
              Active Fleet Damage Liability
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "800", color: "#0f172a" }}
            >
              R {directRepairCost.toLocaleString("en-ZA")}
            </Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "#fef2f2",
              p: 1.5,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "700", color: "#991b1b" }}
            >
              Immediate Financial Drain
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "900", color: "#dc2626" }}
            >
              R {totalDirectLoss.toLocaleString("en-ZA")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              bgcolor: "#fffbeb",
              p: 1.5,
              borderRadius: 2,
              border: "1px solid #fef3c7",
            }}
          >
            <WarningAmber sx={{ color: "#d97706", fontSize: 18, mt: 0.2 }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: "800", color: "#92400e", display: "block" }}
              >
                COST OF INACTION WARNING (ANNUALIZED BURNRATE)
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: "600", color: "#b45309" }}
              >
                If current containment models are ignored, this leakage matrix
                compounds to approximately{" "}
                <strong>R {projectedAnnualBurn.toLocaleString("en-ZA")}</strong>{" "}
                over the next fiscal cycle.
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
