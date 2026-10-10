import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Shield } from "@mui/icons-material";

export default function OhsIntroCard() {
  return (
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
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mb: 2, alignItems: "center" }}
        >
          <Shield sx={{ color: "#1e1b4b", fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: "900", color: "#1e1b4b" }}>
            Occupational Health & Safety Competency
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          Compliance with the{" "}
          <strong>
            Department of Employment and Labour (OHS Act 85 of 1993)
          </strong>{" "}
          requires continuous operational tracking.
        </Typography>
      </CardContent>
    </Card>
  );
}
