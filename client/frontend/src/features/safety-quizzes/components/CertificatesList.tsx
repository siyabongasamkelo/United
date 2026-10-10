import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import {
  CardMembership,
  VerifiedUser,
  CalendarMonth,
  Key,
} from "@mui/icons-material";
import type { ICertificationResponse } from "../services/safetyQuizService";

interface CertificatesListProps {
  certificates: ICertificationResponse[];
}

export default function CertificatesList({
  certificates,
}: CertificatesListProps) {
  if (certificates.length === 0) {
    return (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 3,
          textAlign: "center",
          bgcolor: "#f8fafc",
          borderColor: "#e2e8f0",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "600" }}
        >
          No digital compliance safety credentials logged yet. Pass assigned
          matrices with required scores to lock down badges.
        </Typography>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {certificates.map((cert) => {
        // Handle variations of population safely
        const topicTitle =
          typeof cert.quizTopic === "object"
            ? cert.quizTopic?.title
            : "Safety Module Compliant";
        const riskLevel =
          typeof cert.quizTopic === "object"
            ? cert.quizTopic?.hazardLevel
            : "LOW";

        return (
          <Grid key={cert._id} xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: "#e2e8f0",
                background: "linear-gradient(135deg, #ffffff 0%, #fdfdfd 100%)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                position: "relative",
                overflow: "hidden",
                borderTop: "4px solid #10b981", // Solid green indicator representing passed compliance boundaries
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  sx={{
                    mb: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <CardMembership sx={{ color: "#10b981", fontSize: 32 }} />
                  <Chip
                    label="VERIFIED"
                    size="small"
                    color="success"
                    icon={<VerifiedUser style={{ fontSize: 14 }} />}
                    sx={{
                      fontWeight: "800",
                      fontSize: "0.65rem",
                      borderRadius: 1.5,
                    }}
                  />
                </Stack>

                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#1e1b4b",
                    fontWeight: "900",
                    mb: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {topicTitle}
                </Typography>

                <Stack spacing={1} sx={{ mt: 2, mb: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ color: "text.secondary", alignItems: "center" }}
                  >
                    <CalendarMonth sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ fontWeight: "600" }}>
                      Earned:{" "}
                      {new Date(
                        cert.dateEarned || Date.now(),
                      ).toLocaleDateString()}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ color: "#64748b", alignItems: "center" }}
                  >
                    <Key sx={{ fontSize: 16 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "700",
                        letterSpacing: 0.5,
                        bgcolor: "#f1f5f9",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                      }}
                    >
                      {cert.verificationHash || "CERT-OHS-PENDING"}
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  variant="outlined"
                  fullWidth
                  color="success"
                  onClick={() =>
                    alert(
                      `Verification ID: ${cert.verificationHash}\nLogged securely under OHS framework data registries.`,
                    )
                  }
                  sx={{
                    fontWeight: "800",
                    textTransform: "none",
                    borderRadius: 2,
                    fontSize: "0.8rem",
                    py: 0.75,
                  }}
                >
                  View Digital Credential
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
